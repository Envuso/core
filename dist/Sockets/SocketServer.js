"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.SocketServer = void 0;
const mongodb_1 = require("mongodb");
const path_1 = __importDefault(require("path"));
const tsyringe_1 = require("tsyringe");
const ws_1 = require("ws");
const AppContainer_1 = require("../AppContainer");
const Authentication_1 = require("../Authentication");
const Common_1 = require("../Common");
const SocketChannelListener_1 = require("./SocketChannelListener");
const SocketConnection_1 = require("./SocketConnection");
const SocketEvents_1 = require("./SocketEvents");
const SocketListener_1 = require("./SocketListener");
let SocketServer = class SocketServer {
    constructor(configRepository) {
        this._listeners = new Map();
        /**
         * Stores a user id -> socket ids
         *
         * @type {Map<string, string[]>}
         * @private
         */
        this._connections = new Map();
        this._config = configRepository.get('websockets');
    }
    getServer() {
        return this.server;
    }
    /**
     * Are websockets enabled in the config?
     *
     * @returns {boolean}
     */
    isEnabled() {
        var _a;
        return ((_a = this._config) === null || _a === void 0 ? void 0 : _a.enabled) || true;
    }
    /**
     * Load all of the socket listeners provided by the developer
     *
     * @returns {Promise<void>}
     */
    prepareEventListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            const socketListeners = yield Common_1.FileLoader.importModulesFrom(path_1.default.join(AppContainer_1.config().get('paths.socketListeners'), '**', '*.ts'));
            for (let socketListener of socketListeners) {
                const socketListenerInstance = new socketListener.instance();
                if (socketListenerInstance instanceof SocketChannelListener_1.SocketChannelListener) {
                    if (this._listeners.has(socketListenerInstance.channelName())) {
                        throw new Error('You can not register the same socket channel listener more than once. SocketChannelListener(' + socketListener.name + ') path: ' + socketListener.originalPath);
                    }
                    // Bind the event listener to the container, then we can use di
                    // to inject any services when the listener is used.
                    AppContainer_1.app().container().register('ws:channel:' + socketListenerInstance.channelName(), {
                        useClass: socketListener.instance
                    });
                    Common_1.Log.info('Imported Socket Channel Listener: ' + socketListener.name);
                }
                if (socketListenerInstance instanceof SocketListener_1.SocketListener) {
                    if (this._listeners.has(socketListenerInstance.eventName())) {
                        throw new Error('You can not register the same socket listener more than once. SocketListener(' + socketListener.name + ') path: ' + socketListener.originalPath);
                    }
                    // Bind the event listener to the container, then we can use di
                    // to inject any services when the listener is used.
                    AppContainer_1.app().container().register('ws:listener:' + socketListenerInstance.eventName(), {
                        useClass: socketListener.instance
                    });
                    Common_1.Log.info('Imported Socket Listener: ' + socketListener.name);
                }
            }
        });
    }
    /**
     * Prepare the socket io server to be bound to our fastify server
     *
     * @param app
     * @returns {this}
     */
    initiate(app) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prepareEventListeners();
            app.ready(() => {
                this.server = new ws_1.Server(Object.assign(Object.assign({}, this._config.options), { server: app.server, clientTracking: false }));
                this.createHeartBeat();
                this.server.on('connection', this._handleConnection.bind(this));
            });
            return this;
        });
    }
    /**
     * When we receive a new socket connection we need to add the
     * created connection instance to our map of connected clients
     * and bind the event listeners for this user.
     *
     * @param {WebSocket} socket
     * @param {http.IncomingMessage} request
     */
    _handleConnection(socket, request) {
        new SocketConnection_1.SocketConnection(socket, request).setup((connection) => {
            this.addConnection(connection);
            connection.onDisconnect((userId, id) => {
                this.removeConnection(userId, id);
            });
            connection.send(SocketEvents_1.SocketEvents.SOCKET_READY, {});
        });
    }
    addConnection(connection) {
        if (!this._connections.has(Authentication_1.Auth.id())) {
            this._connections.set(Authentication_1.Auth.id(), new Set());
        }
        this._connections.get(Authentication_1.Auth.id()).add(connection);
    }
    removeConnection(userId, connectionId) {
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
    createHeartBeat() {
        if (this.pingInterval)
            return;
        this.pingInterval = setInterval(() => {
            for (let connections of this._connections.values()) {
                for (let connection of connections) {
                    if (!connection.didRespondToPing()) {
                        connection.disconnect('Didnt respond to ping');
                        return;
                    }
                    connection.setAwaitingPing();
                    connection.send(SocketEvents_1.SocketEvents.SOCKET_PING);
                }
            }
        }, 30000);
    }
    /**
     * Get all of x users socket connection instances
     *
     * @param {ObjectId | string} id
     * @returns {SocketConnection[]}
     */
    getUserSockets(id) {
        if (id instanceof mongodb_1.ObjectId) {
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
    sendToUser(id, event, data) {
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
    sendToUserViaChannel(id, channel, event, data) {
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
    broadcast(listener, channel, event, data) {
        this._connections.forEach((userConnections, userId) => {
            userConnections.forEach((connection) => {
                if (!connection.hasSubscription(listener)) {
                    return;
                }
                connection.sendToChannel(channel, event, data);
            });
        });
    }
};
SocketServer = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [AppContainer_1.ConfigRepository])
], SocketServer);
exports.SocketServer = SocketServer;
//# sourceMappingURL=SocketServer.js.map