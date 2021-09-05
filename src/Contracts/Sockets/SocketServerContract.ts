import {FastifyInstance} from "fastify";
import http from "http";
import {ObjectId} from "mongodb";
import WebSocket, {Server, ServerOptions} from "ws";
import {SocketEvents} from "../../Sockets/SocketEvents";
import {MiddlewareContract} from "../Routing/Middleware/MiddlewareContract";
import {SocketChannelListenerContract} from "./SocketChannelListenerContract";
import {SocketConnectionContract} from "./SocketConnectionContract";
import {SocketPacketContract} from "./SocketPacketContract";

export interface ChannelInformation {
	containerListenerName: string;
	channelName: string;
	wildcardValue: string | null;
}

export type RoomSocketListenerInstance = new() => SocketChannelListenerContract | undefined;

export interface WebsocketsConfiguration {
	//	cors: {
	//		enabled: boolean;
	//		options: CorsOptions
	//	};
	enabled: boolean;
	middleware: (new () => MiddlewareContract)[],
	options: ServerOptions
}

export interface SocketServerContract {
	server: Server;
	pingInterval: NodeJS.Timeout;
	_listeners: Map<string, new () => SocketChannelListenerContract>;
	_config: WebsocketsConfiguration;
	_connections: Map<string, Set<SocketConnectionContract>>;

	getServer(): Server;

	/**
	 * Are websockets enabled in the config?
	 *
	 * @returns {boolean}
	 */
	isEnabled(): any;

	/**
	 * Load all of the socket listeners provided by the developer
	 *
	 * @returns {Promise<void>}
	 */
	prepareEventListeners(): Promise<void>;

	/**
	 * Prepare the socket io server to be bound to our fastify server
	 *
	 * @param app
	 * @returns {this}
	 */
	initiate(app: FastifyInstance): Promise<this>;

	/**
	 * When we receive a new socket connection we need to add the
	 * created connection instance to our map of connected clients
	 * and bind the event listeners for this user.
	 *
	 * @param {WebSocket} socket
	 * @param {http.IncomingMessage} request
	 */
	_handleConnection(socket: WebSocket, request: http.IncomingMessage): void;

	addConnection(connection: SocketConnectionContract): void;

	removeConnection(userId: string, connectionId: string): void;

	createHeartBeat(): void;

	/**
	 * Get all of x users socket connection instances
	 *
	 * @param {ObjectId | string} id
	 * @returns {SocketConnectionContract[]}
	 */
	getUserSockets(id: ObjectId | string): SocketConnectionContract[];

	/**
	 * Send a packet to all of x users socket connections
	 *
	 * @param {ObjectId | string} id
	 * @param event
	 * @param data
	 */
	sendToUser(id: ObjectId | string, event: SocketEvents | string, data: any): void;

	/**
	 *
	 * @param {ObjectId | string} id
	 * @param {{new(): SocketChannelListener}} channel
	 * @param {SocketEvents | string} event
	 * @param data
	 */
	sendToUserViaChannel(id: ObjectId | string, channel: new () => SocketChannelListenerContract, event: SocketEvents | string, data: any): void;

	/**
	 * Broadcast a packet to all connections on a specified socket channel
	 *
	 * @param {SocketChannelListener} listener
	 * @param {string} channel
	 * @param {string} event
	 * @param data
	 */
	broadcast<T extends SocketPacketContract>(listener: (new() => SocketChannelListenerContract) | SocketChannelListenerContract, channel: string, event: string, data: T | any): void;
}
