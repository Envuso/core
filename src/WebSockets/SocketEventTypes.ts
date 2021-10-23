export enum SocketEvents {
	SOCKET_READY                = 'ready',
	SOCKET_DISCONNECT           = 'disconnect',
	CHANNEL_SUBSCRIBE_REQUEST   = 'subscribe-channel-request',
	CHANNEL_SUBSCRIBE_RESPONSE  = 'subscribe-channel-response',
	CHANNEL_UNSUBSCRIBE_REQUEST = 'unsubscribe-channel-request',
}

export type SocketEventPacket = {
	[SocketEvents.SOCKET_READY]: SocketReadyEventPacket,
	[SocketEvents.SOCKET_DISCONNECT]: SocketDisconnectEventPacket,
	[SocketEvents.CHANNEL_SUBSCRIBE_REQUEST]: ChannelSubscribeSocketPacket,
	[SocketEvents.CHANNEL_SUBSCRIBE_RESPONSE]: ChannelSubscribeResponseSocketPacket,
	[SocketEvents.CHANNEL_UNSUBSCRIBE_REQUEST]: ChannelUnsubscribeSocketPacket,
}

export type BaseEventPacket = {
	event: SocketEvents | string;
	data: any
};


export type SocketReadyEventPacket = BaseEventPacket & {
	event: SocketEvents.SOCKET_READY;
};

export type SocketDisconnectEventPacket = BaseEventPacket & {
	event: SocketEvents.SOCKET_DISCONNECT;
	data: {
		reason: string | null;
	}
};

export type ChannelSubscribeSocketPacket = BaseEventPacket & {
	event: SocketEvents.CHANNEL_SUBSCRIBE_REQUEST;
	data: {
		channel: string;
	};
};

export type ChannelSubscribeResponseSocketPacket = BaseEventPacket & {
	event: SocketEvents.CHANNEL_SUBSCRIBE_RESPONSE;
	data: {
		channel: string;
		successful: boolean;
		reason?: string;
	};
};

export type ChannelUnsubscribeSocketPacket = BaseEventPacket & {
	event: SocketEvents.CHANNEL_UNSUBSCRIBE_REQUEST;
	data: {
		channel: string;
	}
};

export type UserMessageSocketPacket = BaseEventPacket & {
	event: any,
	channel: string;
	data: any,
}
