import {SocketConnectionContract} from "./SocketConnectionContract";
import {SocketPacketContract} from "./SocketPacketContract";

export interface SocketListenerContract {
	eventName(): string;

	handle(connection: SocketConnectionContract, user: any, packet: SocketPacketContract): Promise<any>;
}
