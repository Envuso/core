import {ChannelInformation} from "../../WebSockets/WebSocketServer";
import {MiddlewareContract} from "../Routing/Middleware/MiddlewareContract";
import {WebSocketConnectionContract} from "./WebSocketConnectionContract";


export interface WebSocketChannelListenerContract {
	connection: WebSocketConnectionContract<any>;

	channelInfo: ChannelInformation;

	connectedChannelName: string;
	channelWildcardValue: string | null;

	setChannelInformation(channelInfo: ChannelInformation): void;

	getChannelInformation(): ChannelInformation;

	/**
	 * This will output the name for the channel originally subscribed to...
	 * For example, the channel "user:*", if we subscribed to channel "user:1" it will be the "user:1" channel.
	 */
	getChannelName(): any;

	middlewares(): MiddlewareContract[];

	channelName(): string;

	isAuthorised(connection: WebSocketConnectionContract<any>): Promise<boolean>;

	send(event: string, data: any);

	broadcast(event: string, data: any);

	usesWildcardChannel(): boolean;

	/**
	 * Broadcast a packet to a channel with the specified event
	 *
	 * @param {string} channel
	 * @param {string} event
	 * @param data
	 */
	//	broadcast<T extends SocketPacketContract>(channel: string, event: string, data: T | any): void;
}

export interface WebSocketChannelListenerContractConstructor {
	new(): WebSocketChannelListenerContract;

	broadcast(this: new() => WebSocketChannelListenerContract, wildcardValue: string | null, event: string, data: any);

	containerListenerName(this: WebSocketChannelListenerContractConstructor): string;
}
