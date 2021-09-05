import {SocketEvents} from "../../Sockets/SocketEvents";

export interface SocketPacketContract {
	response(): string

	isForChannel(): boolean

	getChannel(): string | undefined

	getEvent(): SocketEvents | string

	getData(): any
}
