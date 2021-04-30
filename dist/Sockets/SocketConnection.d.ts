import { IncomingMessage } from "http";
import WebSocket from "ws";
import { Authenticatable } from "../Common";
import { Middleware } from "../Routing";
import { SocketEvents } from "./SocketEvents";
import { SocketChannelListener } from "./SocketChannelListener";
export declare class SocketConnection {
    private socket;
    private request;
    private token;
    id: string;
    userId: string;
    user: Authenticatable<any>;
    private isConnected;
    /**
     * The callback for the server so we can remove the connection
     *
     * @type {Function}
     * @private
     */
    private _onDisconnectCallback;
    private _subscribedChannels;
    constructor(socket: WebSocket, request: IncomingMessage);
    /**
     * Bind all of the default ws event listeners
     */
    bindListeners(): void;
    /**
     * There are certain "events" that we need to manually handle before they
     * are delivered to the {@see SocketChannelListener} that the developer defines
     *
     * @param {string} data
     * @returns {Promise<void>}
     */
    _handlePacket(data: string): Promise<void>;
    /**
     * Process the token from the original connection, setup the
     * request context, process all global middleware and
     * then finally, bind all socket listeners
     */
    setup(callback: Function): void;
    /**
     * Send the websocket event to the specified {@see SocketChannelListener}
     *
     * @param data
     * @returns {Promise<void>}
     * @private
     */
    private _onMessage;
    private _onEventMessage;
    private _onChannelMessage;
    /**
     * Handle the client sending it's pong back after the server sent ping
     *
     * @param data
     * @private
     */
    private _onPong;
    /**
     * Client lost connection to server
     *
     * @param code
     * @param reason
     * @returns {Promise<void>}
     * @private
     */
    private _onClose;
    /**
     * When the client wants to subscribe to a channel, it will send
     * a socket event to the server asking to connect to x channel
     *
     * The server will call "isAuthorised" on the {@see SocketChannelListener}
     * to determine if x user can use x channel, this allows the
     * developer to implement their own permissions, and...
     * finally we'll respond with the status of the request
     *
     * @param {any} channel
     * @returns {Promise<void>}
     * @private
     */
    private _onChannelSubscribeRequest;
    /**
     * The client library can request to unsubscribe from a channel
     * We'll make sure they have permission to do this, then delete the listener.
     *
     * @param {any} channel
     * @returns {Promise<void>}
     * @private
     */
    private _onChannelUnsubscribeRequest;
    /**
     * We have to send the token in the query string of the socket url
     * For the regular {@see JwtAuthenticationMiddleware} to work, we
     * also need to add this token manually as an authorization header.
     */
    handleToken(): void;
    /**
     * Initialise middlewares defined in the websocket config and prepare them for usage
     *
     * @returns {Middleware[]}
     */
    getGlobalSocketMiddlewares(): Middleware[];
    /**
     * Loop through all middlewares from the config and process them
     *
     * @returns {Promise<void>}
     */
    processMiddlewares(): Promise<void>;
    /**
     * Runs all global middlewares, sets the authenticated
     * user and runs our ws event listeners
     *
     * @returns {Promise<this>}
     */
    prepareConnection(): Promise<this>;
    /**
     * Send a socket event to this connection
     *
     * @param {SocketEvents} event
     * @param data
     */
    send(event: SocketEvents | string, data?: any): void;
    /**
     * Send a socket event to the channel
     *
     * @param {string} channel
     * @param {SocketEvents | string} event
     * @param data
     */
    sendToChannel(channel: string, event: SocketEvents | string, data: any): void;
    /**
     * Disconnect the socket connection
     *
     * @param {string} disconnectReason
     */
    disconnect(disconnectReason: string): void;
    /**
     * When we send a ping, we'll then set this to false, when
     * we receive the pong, it will be set to true.
     *
     * So that for the next ping send to the connection if it's
     * still false, we'll disconnect the client because this
     * means they never responded to the ping
     */
    setAwaitingPing(): void;
    /**
     * Is the client still connected?
     *
     * @returns {boolean}
     */
    didRespondToPing(): boolean;
    /**
     * We need to use a callback to handle the disconnect logic for this connection in {@see SocketServer}.
     * When the client disconnects, this callback will be called with the user id and socket id.
     *
     * @param {Function} callback
     */
    onDisconnect(callback: Function): void;
    /**
     * Does a subscription exist for this ChannelListener?
     *
     * @param {{new(): SocketChannelListener} | SocketChannelListener} channel
     * @returns {boolean}
     */
    hasSubscription(channel: (new () => SocketChannelListener) | SocketChannelListener): boolean;
    /**
     * Get a socket subscription for the listener
     *
     * @param {{new(): SocketChannelListener} | SocketChannelListener} channel
     * @returns {SocketChannelListener}
     */
    getSubscription(channel: (new () => SocketChannelListener) | SocketChannelListener): SocketChannelListener;
}
