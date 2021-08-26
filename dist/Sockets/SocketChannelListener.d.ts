import { Middleware } from "../Routing";
import { SocketConnection } from "./SocketConnection";
import { SocketPacket } from "./SocketPacket";
import { ChannelInformation } from "./SocketServer";
export declare abstract class SocketChannelListener {
    protected channelInfo: ChannelInformation;
    setChannelInformation(channelInfo: ChannelInformation): void;
    getChannelInformation(): ChannelInformation;
    /**
     * This will output the name for the channel originally subscribed to...
     * For example, the channel "user:*", if we subscribed to channel "user:1" it will be the "user:1" channel.
     */
    getChannelName(): string;
    /**
     * An array of middleware to use for this socket listener
     *
     * @returns {Middleware[]}
     */
    abstract middlewares(): Middleware[];
    /**
     * The name of the channel
     * Can use wildcards, for example "user.*"
     *
     * @returns {string}
     */
    abstract channelName(): string;
    /**
     * Determine if the socket connection can access the specified room
     *
     * This will allow us to lock down a room for a user for example.
     * "user:1" can only send/receive on this room.
     *
     * @returns {Promise<boolean>}
     */
    abstract isAuthorised(connection: SocketConnection, user: any): Promise<boolean>;
    /**
     * Broadcast a packet to a channel with the specified event
     *
     * @param {string} channel
     * @param {string} event
     * @param data
     */
    broadcast<T extends SocketPacket>(channel: string, event: string, data: T | any): void;
}
