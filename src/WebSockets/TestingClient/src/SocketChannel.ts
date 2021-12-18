import {
	ChannelSubscribeRequestCallback,
	ChannelSubscribeRequestPacket,
	ChannelSubscribeResponsePacket,
	ChannelUnsubscribeRequest,
	ConnectionStatus,
	ServerEventTypes,
	SocketPacket,
	SocketPacketBody
} from "./index";
import {SocketClient} from "./SocketClient";

const FAILED_TO_SUBSCRIBE_ERROR = 'Failed to connect to channel, likely due to not being authorised to access this channel.';

export class SocketChannel {

	private name: string;

	private client: SocketClient;

	private listeners: Map<string, Function> = new Map();

	public _responseCallback: ChannelSubscribeRequestCallback;


	constructor(name: string, client: SocketClient) {
		this.name   = name;
		this.client = client;
	}

	/**
	 * Subscribe to a socket channel
	 *
	 * @param {ChannelSubscribeRequestCallback} callback
	 */
	public subscribe(callback: ChannelSubscribeRequestCallback) {
		this._responseCallback = callback;

		this.client.emit<ChannelSubscribeRequestPacket>(
			ServerEventTypes.CHANNEL_SUBSCRIBE_REQUEST,
			{channel : this.name}
		);
	}

	/**
	 * Used internally to process whether your subscription was successful or not
	 *
	 * @private
	 * @param {ChannelSubscribeResponsePacket} data
	 */
	public handleSubscriptionResponse(data: ChannelSubscribeResponsePacket) {

		this._responseCallback(
			(data.successful ? null : new Error(FAILED_TO_SUBSCRIBE_ERROR)), this
		);

		if (!data.successful) {
			this.client.removeChannel(this);
		}
	}

	/**
	 * Get the name of this channel
	 *
	 * @returns {string}
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Used internally when the socket client receives a new channel event
	 *
	 * @private
	 * @param {SocketPacket} packet
	 * @returns {this}
	 */
	public dispatchEvent(packet: SocketPacket): this {

		if (!this.listeners.has(packet.event)) {
			throw new Error(`Received event "${packet.event}" on channel "${packet.channel}", but there is no listener registered.`);
		}

		this.listeners.get(packet.event)(packet.data);

		return this;
	}

	/**
	 * Listen for an event on this channel
	 *
	 * @param {string} eventName
	 * @param {(data: T) => void} callback
	 * @returns {this}
	 */
	public listen<T extends SocketPacketBody>(
		eventName: string,
		callback: (data: T) => void
	): this {
		this.listeners.set(eventName, callback);

		return this;
	}

	/**
	 * Emit a websocket event on this channel
	 *
	 * @param {string | ServerEventTypes} event
	 * @param {T} data
	 */
	public emit<T>(event: string | ServerEventTypes, data: T) {

		if (this.client.getConnectionStatus() !== ConnectionStatus.CONNECTED) {
			throw new Error('Cannot send socket event when not connected.');
		}

		this.client.getWs().send(JSON.stringify({
			channel : this.name,
			event   : event,
			data    : data
		}));

	}

	/**
	 * Unsubscribe from this channel and stop receiving events from it.
	 */
	public unsubscribe() {
		this.emit<ChannelUnsubscribeRequest>(ServerEventTypes.CHANNEL_UNSUBSCRIBE_REQUEST, {
			channel : this.name
		});

		this.listeners.clear();

		this.client.removeChannel(this);
	}
}
