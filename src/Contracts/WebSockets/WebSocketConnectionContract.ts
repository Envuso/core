import {WebSocket} from "uWebSockets.js";
import {SocketEventPacket} from "../../WebSockets/SocketEventTypes";
import {RequestContextContract} from "../Routing/Context/RequestContextContract";
import {WebSocketChannelListenerContract} from "./WebSocketChannelListenerContract";

export interface WebSocketConnectionContract<T> {
	token: string;
	uuid: string;
	user: T;
	subscriptions: Map<string, WebSocketChannelListenerContract>;

	sendEvent<E extends keyof SocketEventPacket>(event: E, packetData?: Exclude<SocketEventPacket[E]['data'], 'event'>);

	send(data: string | object);

	subscribe(listener: WebSocketChannelListenerContract);

	unsubscribe(listener: WebSocketChannelListenerContract);

	subscribeToChannelListener(listener: WebSocketChannelListenerContract);

	getSubscription(channelListener: (new () => WebSocketChannelListenerContract) | WebSocketChannelListenerContract): WebSocketChannelListenerContract;

	getSubscriptionsForChannel(listener: (new () => WebSocketChannelListenerContract) | WebSocketChannelListenerContract): WebSocketChannelListenerContract[];

	hasSubscription(channel: (new () => WebSocketChannelListenerContract) | WebSocketChannelListenerContract): boolean;

	setWebSocketConnection(connection: WebSocket);

	closeConnection(reason?: string): void;

	setToken(token: string): WebSocketConnectionContract<T>;

	setUuid(uuid: string): WebSocketConnectionContract<T>;

	setUser(user: T): WebSocketConnectionContract<T>;

	broadcast(channel: string, event: string, data: any);

	context(): RequestContextContract;
}
