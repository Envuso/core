import {ChannelInformation} from "./SocketServer";

export enum SocketEvents {
	SOCKET_PING                 = 'ping',
	SOCKET_PONG                 = 'pong',
	SOCKET_READY                = 'ready',
	CHANNEL_SUBSCRIBE_REQUEST   = 'subscribe-channel-request',
	CHANNEL_SUBSCRIBE_RESPONSE  = 'subscribe-channel-response',
	CHANNEL_UNSUBSCRIBE_REQUEST = 'unsubscribe-channel-request',
}

/**
 * Parse the requested channel name and return information
 * that we need to resolve this listener from the container.
 */
export function parseSocketChannelName(channelName: string): ChannelInformation {
	let searchForRoom = channelName;
	let roomWildcard  = null;

	if (channelName.includes(':')) {

		const parts  = channelName.split(':');
		roomWildcard = parts.pop();

		searchForRoom = [...parts, '*'].join(':');
	}

	return {
		containerListenerName : 'ws:channel:' + searchForRoom,
		channelName           : searchForRoom,
		wildcardValue         : roomWildcard
	};
}
