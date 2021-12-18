import {WebSocket} from 'uWebSockets.js';
import {Classes, METADATA} from "../Common";
import {RequestContextContract} from "../Contracts/Routing/Context/RequestContextContract";
import {WebSocketChannelListenerContract} from "../Contracts/WebSockets/WebSocketChannelListenerContract";
import {WebSocketConnectionContract} from "../Contracts/WebSockets/WebSocketConnectionContract";
import {SocketEventPacket, SocketEvents} from "./SocketEventTypes";
import {WebSocketServer} from "./WebSocketServer";


export class WebSocketConnection<T> implements WebSocketConnectionContract<T> {

	private connection: WebSocket = null;
	public token: string          = null;
	public uuid: string           = null;
	public user: T                = null;

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
	 * @returns {WebSocketChannelListenerContract}
	 * @param channelListener
	 */
	getSubscription(channelListener: (string | (new () => WebSocketChannelListenerContract) | WebSocketChannelListenerContract)): WebSocketChannelListenerContract {
		if (typeof channelListener === 'string') {
			return this.subscriptions.get(channelListener);
		}

		const channel = Classes.getOrInstantiate<WebSocketChannelListenerContract>(channelListener);

		return this.subscriptions.get(channel.getChannelName());
	}

	getSubscriptionsForChannel(listener: (new () => WebSocketChannelListenerContract) | WebSocketChannelListenerContract): WebSocketChannelListenerContract[] {
		const channel = Classes.getOrInstantiate<WebSocketChannelListenerContract>(listener);

		return this.connection.getTopics()
			.filter(t => {
				let channelName = t;

				if (channel.usesWildcardChannel()) {
					const channelInfo = WebSocketServer.parseSocketChannelName(t);
					channelName       = channelInfo.channelName;
				}

				return channelName === channel.channelName();
			})
			.map(t => this.subscriptions.get(t));
	}

	/**
	 * Does a subscription exist for this ChannelListener?
	 *
	 * @param {{new(): WebSocketChannelListenerContract} | WebSocketChannelListenerContract} channel
	 * @returns {boolean}
	 */
	public hasSubscription(channel: (string | (new () => WebSocketChannelListenerContract) | WebSocketChannelListenerContract)): boolean {
		if (typeof channel === 'string') {
			return this.subscriptions.has(channel);
		}

		channel = Classes.getOrInstantiate<WebSocketChannelListenerContract>(channel);

		return this.subscriptions.has(channel.getChannelName());
	}

	subscribe(listener: WebSocketChannelListenerContract) {
		listener.connection = this;
		this.subscriptions.set(listener.connectedChannelName, listener);
		this.connection.subscribe(listener.connectedChannelName);
	}

	unsubscribe(listener: WebSocketChannelListenerContract) {
		this.subscriptions.delete(listener.connectedChannelName);
		this.connection.unsubscribe(listener.connectedChannelName);
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

	public context(): RequestContextContract {
		return Reflect.getMetadata(METADATA.HTTP_CONTEXT, this);
	}
}
