import type {Server, ServerWebSocket} from "bun";
import {JsonWebTokenError} from "jsonwebtoken";
import path from "path";
import {app, config, resolve} from "../AppContainer/helpers";
import type {Authenticatable} from "../Authenticatable";
import {Authentication} from "../Authentication/Authentication";
import {JwtAuthenticationProvider} from "../Authentication/AuthenticationProviders/JwtAuthenticationProvider";
import {FileLoader} from "../Common/Utility/FileLoader";
import {Log} from "../Common/Logger/Log";
import {Str} from "../Common/Utility/Str";
import {ResponseDataFormatter} from "../Common/Http/ResponseDataFormatter";
import type WebsocketsConfiguration from "../Config/WebsocketsConfiguration";
import type {MiddlewareContract} from "../Contracts/Routing/Middleware/MiddlewareContract";
import type {WebSocketChannelListenerContract, WebSocketChannelListenerContractConstructor} from "../Contracts/WebSockets/WebSocketChannelListenerContract";
import {RequestContext} from "../Routing/Context/RequestContext";
import {RequestContextStore} from "../Routing/Context/RequestContextStore";
import {type BaseEventPacket, type ChannelSubscribeSocketPacket, type ChannelUnsubscribeSocketPacket, SocketEvents, type UserMessageSocketPacket} from "./SocketEventTypes";
import {WebSocketChannelListener} from "./WebSocketChannelListener";
import {WebSocketConnection} from "./WebSocketConnection";


export interface ChannelInformation {
	containerListenerName: string;
	channelName: string;
	wildcardValue: string | null;
}

/** Attached to each socket on upgrade (ws.data) */
export interface SocketData {
	url: string;
	token: string | null;
	uuid: string;
	user: Authenticatable<any> | null;
	connection: WebSocketConnection<any>;
}

export type EnvusoWebSocket = ServerWebSocket<SocketData>;

export class WebSocketServer {

	/** One websocket server per process; booting again (e.g. providers re-loaded) replaces it */
	private static active: WebSocketServer = null;

	private config: WebsocketsConfiguration;
	private server: Server<SocketData> = null;
	private connections: Map<string, WebSocketConnection<any>>                 = new Map();
	public _listeners: Map<string, new () => WebSocketChannelListenerContract> = new Map();

	async boot(config: WebsocketsConfiguration) {
		this.config = config;

		if (config.enabled === false) {
			return;
		}

		// Booting twice (this instance or another) would otherwise fail with EADDRINUSE
		await WebSocketServer.active?.unload();
		await this.unload();

		await this.prepareEventListeners();

		this.server = Bun.serve<SocketData>({
			port      : config.port,
			hostname  : config.hostname,
			fetch     : (request, server) => this.handleUpgrade(request, server),
			websocket : {
				...config.server,

				open    : ws => this.handleInContext(ws, () => this.handleOpen(ws)),
				message : (ws, message) => {
					const connection = this.connections.get(ws.data.uuid);
					if (!connection) {
						return;
					}

					RequestContextStore.getInstance().store().enterWith(connection.context());

					return this.handleMessage(ws, message);
				},
				close   : ws => {
					this.connections.delete(ws.data.uuid);
				},
			},
		});

		WebSocketServer.active = this;

		Log.success(`Sockets server running at: ws://${config.hostname === '0.0.0.0' ? '127.0.0.1' : config.hostname}:${this.server.port}`);
	}

	public async unload() {
		if (this.server) {
			await this.server.stop(true);
			this.server = null;
			this.connections.clear();
			if (WebSocketServer.active === this) {
				WebSocketServer.active = null;
			}
			Log.info('WebSocket server unloaded successfully.');
		}
	}

	private async handleUpgrade(request: Request, server: Server<SocketData>): Promise<Response | undefined> {
		// Browsers can't set headers on a websocket, so the JWT comes in as the subprotocol
		const protocol = request.headers.get('sec-websocket-protocol')?.trim() || null;
		let userJwt    = protocol;

		const authProvider: JwtAuthenticationProvider = resolve(Authentication).getAuthProvider(JwtAuthenticationProvider);

		let user = null;
		if (userJwt) {
			try {
				user = await authProvider.authoriseRequest(null, userJwt);
			} catch (error) {
				if (error instanceof JsonWebTokenError) {
					userJwt = null;
				} else {
					Log.error('Failed to authenticate...', error);
				}
			}
		}

		const connection = new WebSocketConnection();
		connection.setUuid(Str.random());
		connection.setToken(userJwt);
		if (user) {
			connection.setUser(user);
		}

		const upgraded = server.upgrade(request, {
			// The client only accepts the connection if its requested subprotocol is echoed back
			headers : protocol ? {'Sec-WebSocket-Protocol' : protocol} : undefined,
			data    : {
				url        : new URL(request.url).pathname,
				token      : userJwt,
				uuid       : connection.uuid,
				user       : user ?? null,
				connection : connection,
			},
		});

		// (Bun runs the open handler synchronously inside upgrade())
		if (!upgraded) {
			return new Response('Expected a websocket upgrade', {status : 426});
		}

		return undefined;
	}

	private handleInContext(ws: EnvusoWebSocket, handle) {
		const conn = ws.data.connection;
		new RequestContext(null, null, conn).bindToSockets(conn, handle);
	}

	private handleOpen(ws: EnvusoWebSocket) {
		const webSocketConnection = ws.data.connection;
		webSocketConnection.setWebSocketConnection(ws);
		this.connections.set(ws.data.uuid, webSocketConnection);

		const req = RequestContext.get();
		req.user  = ws.data.user;

		this.runGlobalMiddleware().then(success => {
			if (!success) {
				return;
			}

			if (req.user) {
				ws.subscribe(`auth:user:${req.user.getId().toString()}`);
			}
			webSocketConnection.sendEvent(SocketEvents.SOCKET_READY);
		});
	}

	private async handleMessage(ws: EnvusoWebSocket, messageData: string | Buffer) {
		const webSocketConnection = this.connections.get(ws.data.uuid);
		const message             = typeof messageData === 'string' ? messageData : messageData.toString('utf-8');

		try {
			const data = JSON.parse(message) as BaseEventPacket;

			switch (data.event) {
				case SocketEvents.CHANNEL_SUBSCRIBE_REQUEST:
					await this.handleChannelSubscription(webSocketConnection, <ChannelSubscribeSocketPacket>data);
					break;
				case SocketEvents.CHANNEL_UNSUBSCRIBE_REQUEST:
					await this.handleChannelUnsubscribe(webSocketConnection, <ChannelUnsubscribeSocketPacket>data);
					break;
				default:
					await this.handleChannelMessageEvent(webSocketConnection, <UserMessageSocketPacket>data);
			}
		} catch (error) {
			Log.exception('WebSocket message handling failed', error);
		}
	}

	/**
	 * Load all of the socket listeners provided by the developer
	 *
	 * @returns {Promise<void>}
	 */
	public async prepareEventListeners() {
		const listenerPath = path.join(config().get<string, any>('Paths.socketListeners'), '**', '*.ts');

		const socketListeners = [
			...await FileLoader.importClassesOfTypeFrom<WebSocketChannelListener>(listenerPath, 'WebSocketChannelListener'),
		];

		for (let socketListener of socketListeners) {
			const socketListenerInstance: WebSocketChannelListener = new socketListener.instance();

			if (socketListenerInstance instanceof WebSocketChannelListener) {
				if (this._listeners.has(socketListenerInstance.channelName())) {
					throw new Error('You can not register the same socket channel listener more than once. SocketChannelListener(' + socketListener.name + ') path: ' + socketListener.originalPath);
				}

				// Bind the event listener to the container, then we can use di
				// to inject any services when the listener is used.
				app().container().register('ws:channel:' + socketListenerInstance.channelName(), {
					//@ts-ignore
					useClass : socketListener.instance
				});

				if (config('app.logging.socketChannels', false))
					Log.info('Imported Socket Channel Listener: ' + socketListener.name);
			}

		}
	}

	public getChannelListener(channelInfo: ChannelInformation) {
		const container = app().container();

		if (!container.isRegistered<WebSocketChannelListenerContract>(channelInfo.containerListenerName)) {
			if (config('app.logging.socketInformation')) {
				Log.error('Listener not found.... ', channelInfo);
			}
			return null;
		}

		const listener = container.resolve<WebSocketChannelListenerContract>(channelInfo.containerListenerName);
		listener.setChannelInformation(channelInfo);

		return listener;
	}

	private async handleChannelSubscription(webSocketConnection: WebSocketConnection<any>, packet: ChannelSubscribeSocketPacket) {
		const channelInfo = WebSocketServer.parseSocketChannelName(packet.data.channel);

		const listener = this.getChannelListener(channelInfo);

		if (!listener) {
			webSocketConnection.sendEvent(SocketEvents.CHANNEL_SUBSCRIBE_RESPONSE, {
				channel    : packet.data.channel,
				successful : false,
				reason     : 'Channel listener not found.'
			});
			return;
		}

		listener.setChannelInformation(channelInfo);

		for (let middleware of listener.middlewares()) {
			try {
				await middleware.handle(webSocketConnection.context());
			} catch (error) {
				if (config('app.logging.socketExceptions')) {
					Log.exception(error);
				} else {
					Log.warn(`WebSocket middleware errored whilst handling: ${error.toString()}`);
				}

				webSocketConnection.sendEvent(SocketEvents.CHANNEL_SUBSCRIBE_RESPONSE, {
					channel    : packet.data.channel,
					successful : false,
					reason     : 'Error occurred whilst subscribing.'
				});

				return;
			}
		}

		await webSocketConnection.subscribeToChannelListener(listener);
	}

	private async handleChannelUnsubscribe(webSocketConnection: WebSocketConnection<any>, packet: ChannelUnsubscribeSocketPacket) {
		const channelInfo = WebSocketServer.parseSocketChannelName(packet.data.channel);

		const listener = this.getChannelListener(channelInfo);

		if (!listener) {
			throw Error('Channel listener not found: ' + channelInfo.channelName);
		}

		listener.setChannelInformation(channelInfo);

		await webSocketConnection.unsubscribe(listener);
	}

	public addGlobalMiddleware(middleware: (new () => MiddlewareContract)) {
		this.config.middleware.push(middleware);
	}

	public removeGlobalMiddleware(middleware: (new () => MiddlewareContract)) {
		this.config.middleware = this.config.middleware.filter(m => m !== middleware);
	}

	private async runGlobalMiddleware() {
		const context = RequestContext.get();

		for (let middleware of this.config.middleware) {
			const mw = new middleware();
			try {
				await mw.handle(context);
			} catch (error) {
				context.socket.closeConnection();

				if (config('app.logging.socketExceptions')) {
					Log.exception(error);
				} else {
					Log.warn(`WebSocket middleware errored whilst handling: ${error.toString()}`);
				}

				return false;
			}
		}

		return true;
	}

	private async handleChannelMessageEvent(webSocketConnection: WebSocketConnection<any>, packet: UserMessageSocketPacket) {
		if (!packet.channel) {
			Log.warn('Received event but it does not have a channel specified, so we cannot handle it.');

			return;
		}

		const channelInfo = WebSocketServer.parseSocketChannelName(packet.channel);
		const listener    = this.getChannelListener(channelInfo);

		if (!listener) {
			Log.warn('Received event for listener, but it doesnt exist: ' + channelInfo.channelName);
			return;
		}

		const subscription = webSocketConnection.getSubscription(listener);
		if (!subscription) {
			Log.warn('No subscription to channel: ' + channelInfo.channelName);
			return;
		}

		const event = packet.event;
		if (!subscription[event]) {
			Log.warn('Received event for listener, but it doesnt have a handler... add "' + event + '(connection: WebSocketConnection<User>, packet : UserMessageSocketPacket): Promise<any>)" to ' + listener.constructor.name + ' class.');
			return;
		}

		await subscription[event](webSocketConnection, packet);
	}

	/**
	 * Parse the requested channel name and return information
	 * that we need to resolve this listener from the container.
	 */
	public static parseSocketChannelName(channelName: string): ChannelInformation {
		let searchForRoom = channelName;
		let roomWildcard  = null;

		if (channelName.includes(':')) {
			const parts  = channelName.split(':');
			roomWildcard = parts.pop();

			searchForRoom = [...parts, '*'].join(':');
		}

		return {
			containerListenerName : 'ws:channel:' + searchForRoom,
			channelName           : searchForRoom,
			wildcardValue         : roomWildcard
		};
	}

	/**
	 * Get an array of the websocket connections for the specified user id
	 * There can be multiple because the user by id x, can have multiple tabs open... etc.
	 *
	 * @param {string} id
	 * @returns {WebSocketConnection[]}
	 */
	public getUserConnections(id: string): WebSocketConnection<any>[] {
		const userConnections = [];

		this.connections.forEach(connection => {
			if (connection.user?._id.toString() === id) {
				userConnections.push(connection);
			}
		});

		return userConnections;
	}

	public static sendToUserViaChannel(id: string, channel: string, event: SocketEvents | string, data: any) {
		resolve(WebSocketServer).sendToUserViaChannel(id, channel, event, data);
	}

	/**
	 * Send a socket event to the user on the specified channel
	 *
	 * @param {string} id
	 * @param {WebSocketChannelListenerContractConstructor} channel
	 * @param {SocketEvents | string} event
	 * @param data
	 */
	public sendToUserViaChannel(
		id: string,
		channel: string,
		event: SocketEvents | string,
		data: any,
	) {
		const connections = this.getUserConnections(id);

		for (let connection of connections) {
			const subscription = connection.getSubscription(channel);

			if (!subscription) {
				continue;
			}

			subscription.send(event, data);
		}
	}

	public static sendToUserId(id: string, event: string, data: any) {
		resolve(WebSocketServer).sendToUserId(id, event, data);
	}

	public sendToUserId(id: string, event: string, data: any) {
		this.server?.publish(`auth:user:${id}`, WebSocketServer.transformSocketSendData({
			event : event,
			data  : data ?? {}
		}));
	}

	public static broadcast(channel: string, event: string, data: any) {
		resolve(WebSocketServer).broadcast(channel, event, data);
	}

	public broadcast(channel: string, event: string, data: any) {
		this.server?.publish(channel, WebSocketServer.transformSocketSendData({
			event   : event,
			channel : channel,
			data    : data ?? {}
		}));
	}

	public static transformSocketSendData(data: any) {
		return JSON.stringify(ResponseDataFormatter.clean(data));
	}

}
