"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketChannelListener = void 0;
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
}
exports.SocketChannelListener = SocketChannelListener;
//# sourceMappingURL=SocketChannelListener.js.map