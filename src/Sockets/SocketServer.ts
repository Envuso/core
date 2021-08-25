import {FastifyInstance} from "fastify";
import http from "http";
import {ObjectId} from "mongodb";
import path from "path";
import {injectable} from "tsyringe";
import WebSocket, {Server, ServerOptions} from 'ws';
import {app, config, ConfigRepository} from "../AppContainer";
import {Auth} from "../Authentication";
import {FileLoader, Log} from "../Common";
import {Middleware} from "../Routing";
import {SocketChannelListener} from "./SocketChannelListener";
import {SocketConnection} from "./SocketConnection";
import {SocketEvents} from "./SocketEvents";
import {SocketListener} from "./SocketListener";
import {SocketPacket} from "./SocketPacket";

export interface ChannelInformation {
	containerListenerName: string;
	channelName: string;
	wildcardValue: string | null;
}

type RoomSocketListenerInstance = new() => SocketChannelListener | undefined;

interface WebsocketsConfiguration {
	//	cors: {
	//		enabled: boolean;
	//		options: CorsOptions
	//	};
	enabled: boolean;
	middleware: (new () => Middleware)[],
	options: ServerOptions
}

@injectable()
export class SocketServer {

	private server: Server;

	private pingInterval: NodeJS.Timeout;

	private _listeners: Map<string, new () => SocketChannelListener> = new Map();

	private _config: WebsocketsConfiguration;

	/**
	 * Stores a user id -> socket ids
	 *
	 * @type {Map<string, string[]>}
	 * @private
	 */
	private _connections: Map<string, Set<SocketConnection>> = new Map();

	constructor(configRepository: ConfigRepository) {
		this._config = configRepository.get<WebsocketsConfiguration>('websockets');
	}

	getServer(): Server {
		return this.server;
	}

	/**
	 * Are websockets enabled in the config?
	 *
	 * @returns {boolean}
	 */
	isEnabled() {
		return this._config?.enabled || true;
	}

	/**
	 * Load all of the socket listeners provided by the developer
	 *
	 * @returns {Promise<void>}
	 */
	async prepareEventListeners() {
		const socketListeners = await FileLoader.importModulesFrom(
			path.join(config().get('paths.socketListeners'), '**', '*.ts')
		);

		for (let socketListener of socketListeners) {

			const socketListenerInstance: SocketChannelListener | SocketListener = new socketListener.instance();

			if (socketListenerInstance instanceof SocketChannelListener) {
				if (this._listeners.has(socketListenerInstance.channelName())) {
					throw new Error('You can not register the same socket channel listener more than once. SocketChannelListener(' + socketListener.name + ') path: ' + socketListener.originalPath);
				}

				// Bind the event listener to the container, then we can use di
				// to inject any services when the listener is used.
				app().container().register('ws:channel:' + socketListenerInstance.channelName(), {
					useClass : socketListener.instance
				});

				Log.info('Imported Socket Channel Listener: ' + socketListener.name);
			}

			if (socketListenerInstance instanceof SocketListener) {
				if (this._listeners.has(socketListenerInstance.eventName())) {
					throw new Error('You can not register the same socket listener more than once. SocketListener(' + socketListener.name + ') path: ' + socketListener.originalPath);
				}

				// Bind the event listener to the container, then we can use di
				// to inject any services when the listener is used.
				app().container().register('ws:listener:' + socketListenerInstance.eventName(), {
					useClass : socketListener.instance
				});

				Log.info('Imported Socket Listener: ' + socketListener.name);
			}


		}
	}

	/**
	 * Prepare the socket io server to be bound to our fastify server
	 *
	 * @param app
	 * @returns {this}
	 */
	async initiate(app: FastifyInstance): Promise<this> {
		await this.prepareEventListeners();

		app.ready(() => {
			this.server = new Server({
				...this._config.options,
				server         : app.server,
				clientTracking : false,
			});

			this.createHeartBeat();

			this.server.on('connection', this._handleConnection.bind(this));
		});


		return this;
	}

	/**
	 * When we receive a new socket connection we need to add the
	 * created connection instance to our map of connected clients
	 * and bind the event listeners for this user.
	 *
	 * @param {WebSocket} socket
	 * @param {http.IncomingMessage} request
	 */
	_handleConnection(socket: WebSocket, request: http.IncomingMessage) {
		new SocketConnection(socket, request).setup(
			(connection: SocketConnection) => {
				this.addConnection(connection);

				connection.onDisconnect((userId, id) => {
					this.removeConnection(userId, id);
				});

				connection.send(SocketEvents.SOCKET_READY, {});
			}
		);
	}

	addConnection(connection: SocketConnection) {
		if (!this._connections.has(Auth.id())) {
			this._connections.set(Auth.id(), new Set());
		}

		this._connections.get(Auth.id()).add(connection);
	}

	removeConnection(userId: string, connectionId: string) {
		const connections = this._connections.get(userId);

		if (!connections) {
			return;
		}

		for (let connection of connections.values()) {
			if (connection.id !== connectionId) {
				continue;
			}

			connections.delete(connection);
		}

		this._connections.set(userId, connections);
	}

	private createHeartBeat() {
		if (this.pingInterval) return;

		this.pingInterval = setInterval(() => {
			for (let connections of this._connections.values()) {
				for (let connection of connections) {

					if (!connection.didRespondToPing()) {
						connection.disconnect('Didnt respond to ping');

						return;
					}

					connection.setAwaitingPing();
					connection.send(SocketEvents.SOCKET_PING);
				}
			}
		}, 30_000);
	}

	/**
	 * Get all of x users socket connection instances
	 *
	 * @param {ObjectId | string} id
	 * @returns {SocketConnection[]}
	 */
	getUserSockets(id: ObjectId | string): SocketConnection[] {
		if (id instanceof ObjectId) {
			id = id.toString();
		}

		const connections = this._connections.get(id) || new Set();

		return [...connections.values()];
	}

	/**
	 * Send a packet to all of x users socket connections
	 *
	 * @param {ObjectId | string} id
	 * @param event
	 * @param data
	 */
	sendToUser(id: ObjectId | string, event: SocketEvents | string, data: any) {
		const connections = this.getUserSockets(id);

		connections.forEach(connection => {
			connection.send(event, data);
		});
	}

	/**
	 *
	 * @param {ObjectId | string} id
	 * @param {{new(): SocketChannelListener}} channel
	 * @param {SocketEvents | string} event
	 * @param data
	 */
	sendToUserViaChannel(id: ObjectId | string, channel: new () => SocketChannelListener, event: SocketEvents | string, data: any) {
		const connections = this.getUserSockets(id);

		connections.forEach(connection => {
			if (connection.hasSubscription(channel)) {

				const subscription = connection.getSubscription(channel);

				if (!subscription) {
					return;
				}

				connection.sendToChannel(subscription.getChannelName(), event, data);
			}
		});
	}

	/**
	 * Broadcast a packet to all connections on a specified socket channel
	 *
	 * @param {SocketChannelListener} listener
	 * @param {string} channel
	 * @param {string} event
	 * @param data
	 */
	broadcast<T extends SocketPacket>(listener: SocketChannelListener, channel: string, event: string, data: T | any) {
		this._connections.forEach((userConnections, userId) => {
			userConnections.forEach((connection) => {
				if (!connection.hasSubscription(listener)) {
					return;
				}

				connection.sendToChannel(
					channel, event, data
				);
			});
		});
	}
}
