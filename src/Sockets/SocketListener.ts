import {SocketConnectionContract} from "../Contracts/Sockets/SocketConnectionContract";
import {SocketListenerContract} from "../Contracts/Sockets/SocketListenerContract";
import {SocketPacketContract} from "../Contracts/Sockets/SocketPacketContract";

export abstract class SocketListener implements SocketListenerContract {

	/**
	 * The event name to listen
	 *
	 * @returns {string}
	 */
	public abstract eventName(): string;

	/**
	 * Handle the received socket event
	 *
	 * @returns {Promise<any>}
	 */
	public abstract handle(connection: SocketConnectionContract, user: any, packet: SocketPacketContract): Promise<any>;
}
