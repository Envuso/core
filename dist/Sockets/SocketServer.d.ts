import { FastifyInstance } from "fastify";
import http from "http";
import { ObjectId } from "mongodb";
import WebSocket, { Server } from 'ws';
import { ConfigRepository } from "../AppContainer";
import { SocketChannelListener } from "./SocketChannelListener";
import { SocketConnection } from "./SocketConnection";
import { SocketEvents } from "./SocketEvents";
import { SocketPacket } from "./SocketPacket";
export interface ChannelInformation {
    containerListenerName: string;
    channelName: string;
    wildcardValue: string | null;
}
export declare class SocketServer {
    private server;
    private pingInterval;
    private _listeners;
    private _config;
    /**
     * Stores a user id -> socket ids
     *
     * @type {Map<string, string[]>}
     * @private
     */
    private _connections;
    constructor(configRepository: ConfigRepository);
    getServer(): Server;
    /**
     * Are websockets enabled in the config?
     *
     * @returns {boolean}
     */
    isEnabled(): true;
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
    addConnection(connection: SocketConnection): void;
    removeConnection(userId: string, connectionId: string): void;
    private createHeartBeat;
    /**
     * Get all of x users socket connection instances
     *
     * @param {ObjectId | string} id
     * @returns {SocketConnection[]}
     */
    getUserSockets(id: ObjectId | string): SocketConnection[];
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
    sendToUserViaChannel(id: ObjectId | string, channel: new () => SocketChannelListener, event: SocketEvents | string, data: any): void;
    /**
     * Broadcast a packet to all connections on a specified socket channel
     *
     * @param {SocketChannelListener} listener
     * @param {string} channel
     * @param {string} event
     * @param data
     */
    broadcast<T extends SocketPacket>(listener: (new () => SocketChannelListener) | SocketChannelListener, channel: string, event: string, data: T | any): void;
}
