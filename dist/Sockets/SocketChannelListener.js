"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketChannelListener = void 0;
const AppContainer_1 = require("../AppContainer");
const SocketServer_1 = require("./SocketServer");
class SocketChannelListener {
    setChannelInformation(channelInfo) {
        this.channelInfo = channelInfo;
    }
    getChannelInformation() {
        return this.channelInfo;
    }
    /**
     * This will output the name for the channel originally subscribed to...
     * For example, the channel "user:*", if we subscribed to channel "user:1" it will be the "user:1" channel.
     */
    getChannelName() {
        return this.channelInfo.channelName.replace('*', this.channelInfo.wildcardValue);
    }
    // Socket events are handled dynamically... cannot really specify any type information
    // So if you happen to look here, these are the available parameters.
    // handle(connection: SocketConnection, user: any, packet : SocketPacket): Promise<any>;
    /**
     * Broadcast a packet to a channel with the specified event
     *
     * @param {string} channel
     * @param {string} event
     * @param data
     */
    broadcast(channel, event, data) {
        AppContainer_1.resolve(SocketServer_1.SocketServer).broadcast(this, channel, event, data);
    }
}
exports.SocketChannelListener = SocketChannelListener;
//# sourceMappingURL=SocketChannelListener.js.map