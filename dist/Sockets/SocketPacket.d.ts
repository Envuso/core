import { SocketEvents } from "./SocketEvents";
export declare class SocketPacket {
    private channel;
    private event;
    private data;
    static create(event: SocketEvents | string, data: any): SocketPacket;
    static createForChannel(channel: string, event: SocketEvents | string, data: any): SocketPacket;
    private setup;
    static createFromReceived(data: any): SocketPacket;
    response(): string;
    isForChannel(): boolean;
    getChannel(): string | undefined;
    getEvent(): SocketEvents | string;
    getData(): any;
}
