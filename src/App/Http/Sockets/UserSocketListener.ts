import {Middleware} from "Routing";
import {injectable} from "tsyringe";
import {Authentication} from "../../../Authentication";
import {Log} from "../../../Common";
import {SocketConnection} from "../../../Sockets/SocketConnection";
import {SocketChannelListener} from "../../../Sockets/SocketChannelListener";
import {SocketPacket} from "../../../Sockets/SocketPacket";
import {User} from "../../Models/User";

@injectable()
export class UserSocketListener extends SocketChannelListener {

	constructor(private auth?: Authentication) {
		super();
	}

	middlewares(): Middleware[] {
		return [];
	}

	channelName(): string {
		return "user:*";
	}

	async isAuthorised(connection: SocketConnection, user: User): Promise<boolean> {
		return this.channelInfo.wildcardValue === user._id.toString();
	}

	async hello(connection: SocketConnection, user: User, packet: SocketPacket): Promise<any> {
		Log.success('GREAT SUCCESS HIGH FIVE');

		connection.send('hello', {message : 'Fuck yeah from ' + user._id});
	}


}
