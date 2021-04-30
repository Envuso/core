"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketPacket = void 0;
const class_transformer_1 = require("class-transformer");
class SocketPacket {
    constructor() {
        this.channel = undefined;
    }
    static create(event, data) {
        return new SocketPacket().setup(undefined, event, data);
    }
    static createForChannel(channel, event, data) {
        return new SocketPacket().setup(channel, event, data);
    }
    setup(channel, event, data) {
        if (channel) {
            this.channel = channel;
        }
        this.event = event;
        this.data = data;
        return this;
    }
    static createFromReceived(data) {
        const packet = new SocketPacket();
        packet.event = data === null || data === void 0 ? void 0 : data.event;
        packet.channel = data === null || data === void 0 ? void 0 : data.channel;
        packet.data = data.data;
        return packet;
    }
    response() {
        return JSON.stringify(class_transformer_1.classToPlain(this));
    }
    isForChannel() {
        return !!this.channel;
    }
    getChannel() {
        return this.channel;
    }
    getEvent() {
        return this.event;
    }
    getData() {
        return this.data;
    }
}
exports.SocketPacket = SocketPacket;
//# sourceMappingURL=SocketPacket.js.map