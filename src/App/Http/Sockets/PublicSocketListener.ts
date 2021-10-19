import {JwtAuthenticationMiddleware, Middleware} from "../../../Routing";
import {injectable} from "tsyringe";
import {Log} from "../../../Common";
import {SocketConnectionContract} from "../../../Contracts/Sockets/SocketConnectionContract";
import {SocketChannelListener} from "../../../Sockets/SocketChannelListener";
import {SocketPacket} from "../../../Sockets/SocketPacket";
import {User} from "../../Models/User";

@injectable()
export class PublicSocketListener extends SocketChannelListener {

	public middlewares(): Middleware[] {
		return [];
	}

	public channelName(): string {
		return "public";
	}

	public async isAuthorised(connection: SocketConnectionContract, user: User): Promise<boolean> {
		return true
	}

	async hello(connection: SocketConnectionContract, user: User, packet: SocketPacket): Promise<any> {
		Log.success('GREAT SUCCESS HIGH FIVE');

		connection.send('hello', {message : 'Fuck yeah from ' + user._id});
	}


}
