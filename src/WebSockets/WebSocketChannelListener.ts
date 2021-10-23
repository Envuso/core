import {resolve} from "../AppContainer";
import {MiddlewareContract} from "../Contracts/Routing/Middleware/MiddlewareContract";
import {WebSocketChannelListenerContract} from "../Contracts/WebSockets/WebSocketChannelListenerContract";
import {WebSocketConnectionContract} from "../Contracts/WebSockets/WebSocketConnectionContract";
import {WebSocketConnection} from "./WebSocketConnection";
import {ChannelInformation, WebSocketServer} from "./WebSocketServer";

export abstract class WebSocketChannelListener implements WebSocketChannelListenerContract {

	public channelInfo: ChannelInformation;

	/**
	 * The name of the channel this user is connected to.
	 *
	 * If we're using wild card channels, this will contain the channel name + wildcard value.
	 *
	 * IE: defined channel name is: "user:*"
	 * We connect to "user:123", this value is "user:123"
	 *
	 * @type {string}
	 */
	public connectedChannelName: string;

	/**
	 * If we're using wild card channels, this will contain the wildcard value.
	 *
	 * IE; we defined "user:*" as the channel name. We connect to "user:123".
	 *
	 * This will be set to "123"
	 *
	 * @type {string | null}
	 */
	public channelWildcardValue: string | null;

	/**
	 * The users web socket connection
	 *
	 * @type {WebSocketConnectionContract<any>}
	 */
	public connection: WebSocketConnectionContract<any>;

	public setChannelInformation(channelInfo: ChannelInformation) {
		this.channelInfo = channelInfo;

		this.channelWildcardValue = channelInfo.wildcardValue;
		this.connectedChannelName = channelInfo.wildcardValue
			? channelInfo.channelName.replace('*', channelInfo.wildcardValue)
			: channelInfo.channelName;
	}

	public usesWildcardChannel(): boolean {
		return this.channelName().includes('*');
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
	public abstract middlewares(): MiddlewareContract[];

	/**
	 * The name of the channel
	 * Can use wildcards, for example "user.*"
	 *
	 * @returns {string}
	 */
	public abstract channelName(): string;

	/**
	 * Determine if the socket connection can access the specified room
	 *
	 * This will allow us to lock down a room for a user for example.
	 * "user:1" can only send/receive on this room.
	 *
	 * @returns {Promise<boolean>}
	 */
	public abstract isAuthorised(connection: WebSocketConnection<any>): Promise<boolean>;

	public send(event: string, data: any) {
		const packet = JSON.stringify({
			event   : event,
			channel : this.getChannelName(),
			data    : data ?? {}
		});

		this.connection.send(packet);
	}

	public static broadcast(this: new() => WebSocketChannelListener, wildcardValue: string | null, event: string, data: any) {
		const c = new this();

		if (c.usesWildcardChannel()) {
			c.channelWildcardValue = wildcardValue;
		}

		c.connectedChannelName = c.getChannelName();

		resolve(WebSocketServer).broadcast(c.connectedChannelName, event, data);
	}

	/**
	 * Broadcast a packet to a channel with the specified event
	 *
	 * @param {string} event
	 * @param data
	 */
	public broadcast(event: string, data: any) {
		resolve(WebSocketServer).broadcast(this.connectedChannelName, event, data);
	}

	/**
	 * Get the socket channel listener's binding name for the container
	 *
	 * @returns {string}
	 */
	public static containerListenerName(this: new () => WebSocketChannelListener): string {
		const c = new this();

		return `ws:channel:${c.channelName()}`;
	}

	// Socket events are handled dynamically... cannot really specify any type information
	// So if you happen to look here, these are the available parameters.

	// handle(connection: SocketConnection, user: any, packet : SocketPacket): Promise<any>;

}
