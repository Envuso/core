import {WebSocket} from 'uWebSockets.js';
import {Classes, METADATA} from "../Common";
import {WebSocketChannelListenerContract} from "../Contracts/WebSockets/WebSocketChannelListenerContract";
import {WebSocketConnectionContract} from "../Contracts/WebSockets/WebSocketConnectionContract";
import {SocketEventPacket, SocketEvents} from "./SocketEventTypes";


export class WebSocketConnection<T> implements WebSocketConnectionContract<T> {

	private connection: WebSocket                                       = null;
	public token: string                                                = null;
	public uuid: string                                                 = null;
	public user: T                                                      = null;
	public subscriptions: Map<string, WebSocketChannelListenerContract> = new Map();

	constructor(connection: WebSocket | null = null) {
		if (connection) {
			this.setWebSocketConnection(connection);
			this.setToken(connection.token);
			this.setUuid(connection.uuid);
		}
	}

	sendEvent<E extends keyof SocketEventPacket>(event: E, packetData: Exclude<SocketEventPacket[E]['data'], 'event'> = null) {
		let packet: any = {
			event : event,
			data  : packetData ?? undefined,
		};

		this.connection.send(JSON.stringify(packet));
	}

	send(data: string | object) {
		if (typeof data !== 'string') {
			data = JSON.stringify(data);
		}
		this.connection.send(data);
	}

	/**
	 * Get the channel subscription instance
	 *
	 * @param {{new(): WebSocketChannelListenerContract} | WebSocketChannelListenerContract} channel
	 * @returns {WebSocketChannelListenerContract}
	 */
	getSubscription(channel: (new () => WebSocketChannelListenerContract) | WebSocketChannelListenerContract): WebSocketChannelListenerContract {
		channel = Classes.getOrInstantiate<WebSocketChannelListenerContract>(channel);

		return this.subscriptions.get(channel.channelName());
	}

	/**
	 * Does a subscription exist for this ChannelListener?
	 *
	 * @param {{new(): WebSocketChannelListenerContract} | WebSocketChannelListenerContract} channel
	 * @returns {boolean}
	 */
	public hasSubscription(channel: (new () => WebSocketChannelListenerContract) | WebSocketChannelListenerContract): boolean {
		channel = Classes.getOrInstantiate<WebSocketChannelListenerContract>(channel);

		return this.subscriptions.has(channel.channelName());
	}

	subscribe(listener: WebSocketChannelListenerContract) {
		const channelName = listener.channelInfo.channelName;

		listener.connection = this;
		this.subscriptions.set(channelName, listener);

		this.connection.subscribe(channelName);
	}

	unsubscribe(listener: WebSocketChannelListenerContract) {
		const channelName = listener.channelInfo.channelName;

		this.subscriptions.delete(channelName);
		this.connection.unsubscribe(channelName);
	}

	public async subscribeToChannelListener(listener: WebSocketChannelListenerContract) {
		const canSubscribe = await listener.isAuthorised(this);

		if (canSubscribe) {
			this.subscribe(listener);
		}

		this.sendEvent(SocketEvents.CHANNEL_SUBSCRIBE_RESPONSE, {
			channel    : listener.getChannelName(),
			successful : canSubscribe
		});
	}

	public closeConnection(reason: string = null) {
		this.sendEvent(SocketEvents.SOCKET_DISCONNECT, {reason : reason ?? 'Force close'});

		this.connection.end(1000, reason ?? 'Force close.');
	}

	setWebSocketConnection(connection: WebSocket): this {
		this.connection = connection;

		return this;
	}

	setToken(token: string): this {
		this.token = token;

		return this;
	}

	setUuid(uuid: string): this {
		this.uuid = uuid;

		return this;
	}

	public setUser(user: T): this {
		this.user = user;

		return this;
	}

	public broadcast(channel: string, event: string, data: any) {
		this.connection.publish(channel, JSON.stringify({
			event   : event,
			channel : channel,
			data    : data ?? {}
		}));
	}

	public context() {
		return Reflect.getMetadata(METADATA.HTTP_CONTEXT, this);
	}
}
