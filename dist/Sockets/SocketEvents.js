"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSocketChannelName = exports.SocketEvents = void 0;
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["SOCKET_PING"] = "ping";
    SocketEvents["SOCKET_PONG"] = "pong";
    SocketEvents["SOCKET_READY"] = "ready";
    SocketEvents["CHANNEL_SUBSCRIBE_REQUEST"] = "subscribe-channel-request";
    SocketEvents["CHANNEL_SUBSCRIBE_RESPONSE"] = "subscribe-channel-response";
    SocketEvents["CHANNEL_UNSUBSCRIBE_REQUEST"] = "unsubscribe-channel-request";
})(SocketEvents = exports.SocketEvents || (exports.SocketEvents = {}));
/**
 * Parse the requested channel name and return information
 * that we need to resolve this listener from the container.
 */
function parseSocketChannelName(channelName) {
    let searchForRoom = channelName;
    let roomWildcard = null;
    if (channelName.includes(':')) {
        const parts = channelName.split(':');
        roomWildcard = parts.pop();
        searchForRoom = [...parts, '*'].join(':');
    }
    return {
        containerListenerName: 'ws:channel:' + searchForRoom,
        channelName: searchForRoom,
        wildcardValue: roomWildcard
    };
}
exports.parseSocketChannelName = parseSocketChannelName;
//# sourceMappingURL=SocketEvents.js.map