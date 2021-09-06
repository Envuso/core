import {FastifyInstance} from "fastify";
import http from "http";
import {ObjectId} from "mongodb";
import path from "path";
import {delay, inject, injectable} from "tsyringe";
import WebSocket, {Server} from 'ws';
import {app, config, ConfigRepository} from "../AppContainer";
import {Auth} from "../Authentication";
import {FileLoader, Log} from "../Common";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {SocketChannelListenerContract} from "../Contracts/Sockets/SocketChannelListenerContract";
import {SocketConnectionContract} from "../Contracts/Sockets/SocketConnectionContract";
import {SocketPacketContract} from "../Contracts/Sockets/SocketPacketContract";
import {SocketServerContract, WebsocketsConfiguration} from "../Contracts/Sockets/SocketServerContract";
import {SocketChannelListener} from "./SocketChannelListener";
import {SocketConnection} from "./SocketConnection";
import {SocketEvents} from "./SocketEvents";
import {SocketListener} from "./SocketListener";



@injectable()
export class SocketServer implements SocketServerContract {

	public server: Server;

	public pingInterval: NodeJS.Timeout;

	public _listeners: Map<string, new () => SocketChannelListenerContract> = new Map();

	public _config: WebsocketsConfiguration;

	/**
	 * Stores a user id -> socket ids
	 *
	 * @type {Map<string, string[]>}
	 * @private
	 */
	public _connections: Map<string, Set<SocketConnectionContract>> = new Map();

	constructor(@inject(delay(() => ConfigRepository)) configRepository: ConfigRepositoryContract) {
		this._config = configRepository.get('Websockets');
	}

	public getServer(): Server {
		return this.server;
	}

	/**
	 * Are websockets enabled in the config?
	 *
	 * @returns {boolean}
	 */
	public isEnabled() {
		return this._config?.enabled || true;
	}

	/**
	 * Load all of the socket listeners provided by the developer
	 *
	 * @returns {Promise<void>}
	 */
	public async prepareEventListeners() {
		const socketListeners = await FileLoader.importModulesFrom<SocketChannelListener | SocketListener>(
			path.join(config().get<string, any>('Paths.socketListeners'), '**', '*.ts')
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
	public async initiate(app: FastifyInstance): Promise<this> {
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
	public _handleConnection(socket: WebSocket, request: http.IncomingMessage) {
		new SocketConnection(socket, request).setup(
			(connection: SocketConnectionContract) => {
				this.addConnection(connection);

				connection.onDisconnect((userId, id) => {
					this.removeConnection(userId, id);
				});

				connection.send(SocketEvents.SOCKET_READY, {});
			}
		);
	}

	public addConnection(connection: SocketConnectionContract) {
		if (!this._connections.has(Auth.id())) {
			this._connections.set(Auth.id(), new Set());
		}

		this._connections.get(Auth.id()).add(connection);
	}

	public removeConnection(userId: string, connectionId: string) {
		const connections = this._connections.get(userId);

		if (!connections) {
			return;
		}

		if (connections.size === 0) {
			this._connections.delete(userId);
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

	public createHeartBeat() {
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
	public getUserSockets(id: ObjectId | string): SocketConnectionContract[] {
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
	public sendToUser(id: ObjectId | string, event: SocketEvents | string, data: any) {
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
	public sendToUserViaChannel(id: ObjectId | string, channel: new () => SocketChannelListenerContract, event: SocketEvents | string, data: any) {
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
	public broadcast<T extends SocketPacketContract>(listener: (new() => SocketChannelListenerContract) | SocketChannelListenerContract, channel: string, event: string, data: T | any) {
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
