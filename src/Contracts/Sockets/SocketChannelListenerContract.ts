import {MiddlewareContract} from "../Routing/Middleware/MiddlewareContract";
import {SocketConnectionContract} from "./SocketConnectionContract";
import {SocketPacketContract} from "./SocketPacketContract";
import {ChannelInformation} from "./SocketServerContract";


export interface SocketChannelListenerContractConstructor {
	new(): SocketChannelListenerContract;
}

export interface SocketChannelListenerContract {

	channelInfo: ChannelInformation;

	setChannelInformation(channelInfo: ChannelInformation): void;

	getChannelInformation(): ChannelInformation;

	/**
	 * This will output the name for the channel originally subscribed to...
	 * For example, the channel "user:*", if we subscribed to channel "user:1" it will be the "user:1" channel.
	 */
	getChannelName(): any;

	middlewares(): MiddlewareContract[];

	channelName(): string;

	isAuthorised(connection: SocketConnectionContract, user: any): Promise<boolean>;

	/**
	 * Broadcast a packet to a channel with the specified event
	 *
	 * @param {string} channel
	 * @param {string} event
	 * @param data
	 */
	broadcast<T extends SocketPacketContract>(channel: string, event: string, data: T | any): void;
}
