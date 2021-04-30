import {SocketConnection} from "./SocketConnection";
import {SocketPacket} from "./SocketPacket";

export abstract class SocketListener {

	/**
	 * The event name to listen
	 *
	 * @returns {string}
	 */
	abstract eventName(): string;

	/**
	 * Handle the received socket event
	 *
	 * @returns {Promise<any>}
	 */
	abstract handle(connection: SocketConnection, user: any, packet: SocketPacket): Promise<any>;
}
