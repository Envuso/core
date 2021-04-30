"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketConnection = void 0;
const querystring_1 = __importDefault(require("querystring"));
const AppContainer_1 = require("../AppContainer");
const Authentication_1 = require("../Authentication");
const Common_1 = require("../Common");
const Routing_1 = require("../Routing");
const SocketEvents_1 = require("./SocketEvents");
const SocketChannelListener_1 = require("./SocketChannelListener");
const SocketPacket_1 = require("./SocketPacket");
class SocketConnection {
    constructor(socket, request) {
        this._subscribedChannels = new Map();
        this.id = Common_1.Str.uniqueRandom(20);
        this.socket = socket;
        this.request = request;
        this.isConnected = true;
    }
    /**
     * Bind all of the default ws event listeners
     */
    bindListeners() {
        Common_1.Log.info(`Socket connected - id: ${this.id} - userId: ${this.userId}`);
        this.socket.on("message", this._handlePacket.bind(this));
        this.socket.on("close", this._onClose.bind(this));
    }
    /**
     * There are certain "events" that we need to manually handle before they
     * are delivered to the {@see SocketChannelListener} that the developer defines
     *
     * @param {string} data
     * @returns {Promise<void>}
     */
    _handlePacket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const packet = JSON.parse(data);
            switch (packet.event) {
                case SocketEvents_1.SocketEvents.SOCKET_PONG:
                    this._onPong(data);
                    break;
                case SocketEvents_1.SocketEvents.CHANNEL_SUBSCRIBE_REQUEST:
                    yield this._onChannelSubscribeRequest(packet.data);
                    break;
                case SocketEvents_1.SocketEvents.CHANNEL_UNSUBSCRIBE_REQUEST:
                    yield this._onChannelUnsubscribeRequest(packet.data);
                    break;
                default:
                    yield this._onMessage(packet);
            }
        });
    }
    /**
     * Process the token from the original connection, setup the
     * request context, process all global middleware and
     * then finally, bind all socket listeners
     */
    setup(callback) {
        this.handleToken();
        new Routing_1.RequestContext(this.request, undefined, this).bindToSockets(() => __awaiter(this, void 0, void 0, function* () {
            yield this.prepareConnection();
            callback(this);
        }));
    }
    /**
     * Send the websocket event to the specified {@see SocketChannelListener}
     *
     * @param data
     * @returns {Promise<void>}
     * @private
     */
    _onMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const packet = SocketPacket_1.SocketPacket.createFromReceived(data);
            if (packet.isForChannel()) {
                yield this._onChannelMessage(packet);
                return;
            }
            yield this._onEventMessage(packet);
        });
    }
    _onEventMessage(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelInformation = {
                channelName: packet.getEvent(),
                containerListenerName: 'ws:listener:' + packet.getEvent(),
                wildcardValue: null,
            };
            const listener = AppContainer_1.resolve(channelInformation.containerListenerName);
            if (!listener) {
                Common_1.Log.warn('Received socket event: ' + channelInformation.channelName + '... but no event listener is defined for this event.');
                return;
            }
            yield listener.handle(this, this.user, packet);
        });
    }
    _onChannelMessage(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelInformation = SocketEvents_1.parseSocketChannelName(packet.getChannel());
            const listener = AppContainer_1.resolve(channelInformation.containerListenerName);
            if (!this.hasSubscription(listener)) {
                Common_1.Log.warn("Someone sent a message to a channel that they're not subscribed to...", channelInformation);
                return;
            }
            for (let middleware of listener.middlewares()) {
                yield middleware.handle(Routing_1.RequestContext.get());
            }
            if (!listener[packet.getEvent()]) {
                Common_1.Log.warn('Trying to use event name that is not registered: ' + packet.getEvent());
                return;
            }
            yield listener[packet.getEvent()](this, this.user, packet);
        });
    }
    /**
     * Handle the client sending it's pong back after the server sent ping
     *
     * @param data
     * @private
     */
    _onPong(data) {
        Common_1.Log.info(`Socket pong from: ${this.id} userId: ${this.userId}`);
        this.isConnected = true;
    }
    /**
     * Client lost connection to server
     *
     * @param code
     * @param reason
     * @returns {Promise<void>}
     * @private
     */
    _onClose(code, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            this.disconnect(reason);
            Common_1.Log.info('Socket closed...', { code, reason });
        });
    }
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
    _onChannelSubscribeRequest({ channel }) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelInfo = SocketEvents_1.parseSocketChannelName(channel);
            const listener = AppContainer_1.resolve(channelInfo.containerListenerName);
            if (!listener) {
                console.error('Listener not found.... ', channelInfo);
                return;
            }
            listener.setChannelInformation(channelInfo);
            const canSubscribe = yield listener.isAuthorised(this, this.user);
            if (canSubscribe) {
                this._subscribedChannels.set(channelInfo.channelName, listener);
            }
            this.send(SocketEvents_1.SocketEvents.CHANNEL_SUBSCRIBE_RESPONSE, {
                channel: listener.getChannelName(),
                successful: canSubscribe
            });
        });
    }
    /**
     * The client library can request to unsubscribe from a channel
     * We'll make sure they have permission to do this, then delete the listener.
     *
     * @param {any} channel
     * @returns {Promise<void>}
     * @private
     */
    _onChannelUnsubscribeRequest({ channel }) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelInfo = SocketEvents_1.parseSocketChannelName(channel);
            const listener = AppContainer_1.resolve(channelInfo.containerListenerName);
            if (!listener) {
                console.error('Listener not found.... ', channelInfo);
                return;
            }
            const subscription = this._subscribedChannels.get(channelInfo.channelName);
            if (!subscription) {
                return;
            }
            const isAuthorised = yield subscription.isAuthorised(this, this.user);
            if (!isAuthorised) {
                return;
            }
            this._subscribedChannels.delete(channelInfo.channelName);
        });
    }
    /**
     * We have to send the token in the query string of the socket url
     * For the regular {@see JwtAuthenticationMiddleware} to work, we
     * also need to add this token manually as an authorization header.
     */
    handleToken() {
        const query = querystring_1.default.parse(querystring_1.default.unescape(this.request.url.replace('/?', '')));
        this.request.headers.authorization = `Bearer ${query.token}`;
        this.token = query.token;
    }
    /**
     * Initialise middlewares defined in the websocket config and prepare them for usage
     *
     * @returns {Middleware[]}
     */
    getGlobalSocketMiddlewares() {
        const middlewares = AppContainer_1.config('websockets.middleware');
        return middlewares.map(m => new m());
    }
    /**
     * Loop through all middlewares from the config and process them
     *
     * @returns {Promise<void>}
     */
    processMiddlewares() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let middleware of this.getGlobalSocketMiddlewares()) {
                yield middleware.handle(Routing_1.RequestContext.get());
            }
        });
    }
    /**
     * Runs all global middlewares, sets the authenticated
     * user and runs our ws event listeners
     *
     * @returns {Promise<this>}
     */
    prepareConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.processMiddlewares();
            this.userId = Authentication_1.Auth.id();
            this.user = Authentication_1.Auth.user();
            // Assign the connection id to the request
            // So we can track it more efficiently
            this.request.userId = this.userId;
            this.request.connectionId = this.id;
            this.bindListeners();
            return this;
        });
    }
    /**
     * Send a socket event to this connection
     *
     * @param {SocketEvents} event
     * @param data
     */
    send(event, data = {}) {
        this.socket.send(SocketPacket_1.SocketPacket.create(event, data).response());
    }
    /**
     * Send a socket event to the channel
     *
     * @param {string} channel
     * @param {SocketEvents | string} event
     * @param data
     */
    sendToChannel(channel, event, data) {
        this.socket.send(SocketPacket_1.SocketPacket.createForChannel(channel, event, data).response());
    }
    /**
     * Disconnect the socket connection
     *
     * @param {string} disconnectReason
     */
    disconnect(disconnectReason) {
        this.socket.terminate();
        this._onDisconnectCallback(this.userId, this.id);
        Common_1.Log.info('Socket disconnected: ' + disconnectReason, { id: this.id });
    }
    /**
     * When we send a ping, we'll then set this to false, when
     * we receive the pong, it will be set to true.
     *
     * So that for the next ping send to the connection if it's
     * still false, we'll disconnect the client because this
     * means they never responded to the ping
     */
    setAwaitingPing() {
        this.isConnected = false;
    }
    /**
     * Is the client still connected?
     *
     * @returns {boolean}
     */
    didRespondToPing() {
        return this.isConnected;
    }
    /**
     * We need to use a callback to handle the disconnect logic for this connection in {@see SocketServer}.
     * When the client disconnects, this callback will be called with the user id and socket id.
     *
     * @param {Function} callback
     */
    onDisconnect(callback) {
        this._onDisconnectCallback = callback;
    }
    /**
     * Does a subscription exist for this ChannelListener?
     *
     * @param {{new(): SocketChannelListener} | SocketChannelListener} channel
     * @returns {boolean}
     */
    hasSubscription(channel) {
        const channelInst = (channel instanceof SocketChannelListener_1.SocketChannelListener) ? channel : new channel();
        return this._subscribedChannels.has(channelInst.channelName());
    }
    /**
     * Get a socket subscription for the listener
     *
     * @param {{new(): SocketChannelListener} | SocketChannelListener} channel
     * @returns {SocketChannelListener}
     */
    getSubscription(channel) {
        const channelInst = (channel instanceof SocketChannelListener_1.SocketChannelListener) ? channel : new channel();
        return this._subscribedChannels.get(channelInst.channelName());
    }
}
exports.SocketConnection = SocketConnection;
//# sourceMappingURL=SocketConnection.js.map