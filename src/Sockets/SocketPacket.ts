import {classToPlain} from "class-transformer";
import {SocketPacketContract} from "../Contracts/Sockets/SocketPacketContract";
import {SocketEvents} from "./SocketEvents";

export class SocketPacket implements SocketPacketContract {

	private channel: string | undefined = undefined;

	private event: SocketEvents | string;

	private data: any;

	static create(event: SocketEvents | string, data: any): SocketPacket {
		return new SocketPacket().setup(undefined, event, data);
	}

	public static createForChannel(channel: string, event: SocketEvents | string, data: any) {
		return new SocketPacket().setup(channel, event, data);
	}

	private setup(channel: string | undefined, event: SocketEvents | string, data: any): this {
		if (channel) {
			this.channel = channel;
		}
		this.event = event;
		this.data  = data;

		return this;
	}

	static createFromReceived(data: any): SocketPacketContract {
		const packet   = new SocketPacket();
		packet.event   = data?.event;
		packet.channel = data?.channel;
		packet.data    = data.data;
		return packet;
	}

	response(): string {
		return JSON.stringify(
			classToPlain(this)
		);
	}

	isForChannel(): boolean {
		return !!this.channel;
	}

	getChannel(): string | undefined {
		return this.channel;
	}

	getEvent(): SocketEvents | string {
		return this.event;
	}

	getData(): any {
		return this.data;
	}

}
