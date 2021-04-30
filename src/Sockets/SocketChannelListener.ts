import {Middleware} from "../Routing";
import {SocketConnection} from "./SocketConnection";
import {ChannelInformation} from "./SocketServer";

export abstract class SocketChannelListener {

	protected channelInfo: ChannelInformation;

	public setChannelInformation(channelInfo: ChannelInformation) {
		this.channelInfo = channelInfo;
	}

	public getChannelInformation(): ChannelInformation {
		return this.channelInfo;
	}

	/**
	 * This will output the name for the channel originally subscribed to...
	 * For example, the channel "user:*", if we subscribed to channel "user:1" it will be the "user:1" channel.
	 */
	public getChannelName() {
		return this.channelInfo.channelName.replace('*', this.channelInfo.wildcardValue);
	}

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

	// Socket events are handled dynamically... cannot really specify any type information
	// So if you happen to look here, these are the available parameters.

	// handle(connection: SocketConnection, user: any, packet : SocketPacket): Promise<any>;

}
