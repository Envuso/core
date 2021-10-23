import {Buffer} from "buffer";
import {JsonWebTokenError} from "jsonwebtoken";
import path from "path";
import {
	App,
	HttpRequest,
	HttpResponse,
	TemplatedApp,
	us_listen_socket,
	us_listen_socket_close,
	us_socket_context_t,
	WebSocket
} from 'uWebSockets.js';
import {app, config, resolve} from "../AppContainer";
import {Authenticatable} from "../Authenticatable";
import {Authentication, JwtAuthenticationProvider} from "../Authentication";
import {Obj, FileLoader, Log, Str} from "../Common";
import WebsocketsConfiguration, {uWsBehaviour} from "../Config/WebsocketsConfiguration";
import {MiddlewareContract} from "../Contracts/Routing/Middleware/MiddlewareContract";
import {WebSocketChannelListenerContract, WebSocketChannelListenerContractConstructor} from "../Contracts/WebSockets/WebSocketChannelListenerContract";
import {RequestContext} from "../Routing";
import {RequestContextStore} from "../Routing/Context/RequestContextStore";
import {BaseEventPacket, ChannelSubscribeSocketPacket, ChannelUnsubscribeSocketPacket, SocketEvents, UserMessageSocketPacket} from "./SocketEventTypes";
import {WebSocketChannelListener} from "./WebSocketChannelListener";
import {WebSocketConnection} from "./WebSocketConnection";


export interface ChannelInformation {
	containerListenerName: string;
	channelName: string;
	wildcardValue: string | null;
}

export class WebSocketServer {

	private config: WebsocketsConfiguration;
	private listenSocket: us_listen_socket;
	private app: TemplatedApp;
	private connections: Map<string, WebSocketConnection<any>>                 = new Map();
	public _listeners: Map<string, new () => WebSocketChannelListenerContract> = new Map();

	async boot(config: WebsocketsConfiguration) {
		this.config = config;

		this.app = App(this.config.uWebsocketAppOptions);

		await this.prepareEventListeners();

		this.app.ws('/*', {
			...(Obj.only<uWsBehaviour>(this.config.uWebsocketServerBehaviour, ['maxPayloadLength', 'idleTimeout', 'compression', 'maxBackpressure'])),

			upgrade : this._handleUpgrade.bind(this),
			open    : ws => this.handleInContext(ws, () => this._handleOpen(ws as CustomWebSocket)),
			message : (ws, message, isBinary) => {
				RequestContextStore.getInstance().store().enterWith(this.connections.get(ws.uuid).context());

				this._handleMessage(ws, message, isBinary);
			},
			drain   : ws => {
				console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
			},
			close   : (ws, code, message) => {
				this.connections.delete(ws.uuid);
			}
		});

		this.app.listen(config.port, listenSocket => {
			Log.success("Sockets server running at: ws://127.0.0.1:" + config.port);

			this.listenSocket = listenSocket;
		});
	}

	public async unload() {
		if (this.listenSocket) {
			us_listen_socket_close(this.listenSocket);
			this.listenSocket = null;
			Log.info('WebSocket server unloaded successfully.');
		}
	}

	private async _handleUpgrade(res: HttpResponse, req: HttpRequest, context: us_socket_context_t) {

		const upgradeAborted = {aborted : false};

		/* You MUST copy data out of req here, as req is only valid within this immediate callback */
		const url                    = req.getUrl();
		const secWebSocketKey        = req.getHeader('sec-websocket-key');
		const secWebSocketProtocol   = req.getHeader('sec-websocket-protocol');
		const secWebSocketExtensions = req.getHeader('sec-websocket-extensions');
		let userJwt                  = secWebSocketProtocol.trim() === '' ? null : secWebSocketProtocol;
		const connectionUuid         = Str.random();

		/* You MUST register an abort handler to know if the upgrade was aborted by peer */
		res.onAborted(() => {
			/* We can simply signal that we were aborted */
			upgradeAborted.aborted = true;
		});

		const authProvider: JwtAuthenticationProvider = resolve(Authentication).getAuthProvider(JwtAuthenticationProvider);

		let user = null;
		try {
			user = await authProvider.authoriseRequest(null, userJwt);
		} catch (error) {
			if (error instanceof JsonWebTokenError) {
				userJwt = null;
			} else {
				Log.error('Failed to authenticate...', error);
			}
		}

		if (upgradeAborted.aborted) {
			console.log("Ouch! Client disconnected before we could upgrade it!");
			return;
		}

		const connection = new WebSocketConnection();
		connection.setUuid(connectionUuid);
		connection.setToken(userJwt);
		if (user) {
			connection.setUser(user);
		}

		this.connections.set(connectionUuid, connection);

		res.upgrade(
			{
				url        : url,
				token      : userJwt,
				uuid       : connectionUuid,
				user       : user ?? null,
				connection : connection,
			},
			secWebSocketKey,
			secWebSocketProtocol,
			secWebSocketExtensions,
			context
		);
	}

	private handleInContext(ws: WebSocket, handle) {
		const conn = this.connections.get(ws.uuid);
		new RequestContext(null, null, conn).bindToSockets(conn, handle);
	}

	private _handleOpen(ws: CustomWebSocket) {
		if (ws.connection) {
			ws.connection.setWebSocketConnection(ws);
			this.connections.set(ws.uuid, ws.connection);
		}

		const webSocketConnection = this.connections.get(ws.uuid);

		const req = RequestContext.get();
		req.user  = ws.user;

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

	private async _handleMessage(ws: WebSocket, messageData: ArrayBuffer, isBinary: boolean) {
		const webSocketConnection = this.connections.get(ws.uuid);
		const message             = Buffer.from(messageData).toString('utf-8');

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
			console.error(error);
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

		return container.resolve<WebSocketChannelListenerContract>(channelInfo.containerListenerName);
	}

	private async handleChannelSubscription(webSocketConnection: WebSocketConnection<any>, packet: ChannelSubscribeSocketPacket) {
		const channelInfo = this.parseSocketChannelName(packet.data.channel);

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
		const channelInfo = this.parseSocketChannelName(packet.data.channel);

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

		const channelInfo = this.parseSocketChannelName(packet.channel);
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
	parseSocketChannelName(channelName: string): ChannelInformation {
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

	public static sendToUserViaChannel(id: string, channel: WebSocketChannelListenerContractConstructor, event: SocketEvents | string, data: any) {
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
	public sendToUserViaChannel(id: string, channel: WebSocketChannelListenerContractConstructor, event: SocketEvents | string, data: any) {
		const connections = this.getUserConnections(id);

		for (let connection of connections) {
			const channelSubscription = connection.getSubscription(channel);

			if (!channelSubscription) {
				continue;
			}

			channelSubscription.send(event, data);
		}
	}

	public static sendToUserId(id: string, event: string, data: any) {
		resolve(WebSocketServer).sendToUserId(id, event, data);
	}

	public sendToUserId(id: string, event: string, data: any) {
		this.app.publish(`auth:user:${id}`, JSON.stringify({
			event : event,
			data  : data ?? {}
		}));
	}

	public static broadcast(channel: string, event: string, data: any) {
		resolve(WebSocketServer).broadcast(channel, event, data);
	}

	public broadcast(channel: string, event: string, data: any) {
		this.app.publish(channel, JSON.stringify({
			event   : event,
			channel : channel,
			data    : data ?? {}
		}));
	}
}

export interface CustomWebSocket extends WebSocket {
	url: string;
	token: string | null;
	uuid: string;
	user: Authenticatable<any> | null;
	connection: WebSocketConnection<any>;
}
