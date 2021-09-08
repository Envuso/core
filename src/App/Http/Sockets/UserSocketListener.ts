import {JwtAuthenticationMiddleware, Middleware} from "../../../Routing";
import {injectable} from "tsyringe";
import {Log} from "../../../Common";
import {AuthenticationContract} from "../../../Contracts/Authentication/AuthenticationContract";
import {SocketConnectionContract} from "../../../Contracts/Sockets/SocketConnectionContract";
import {SocketChannelListener} from "../../../Sockets/SocketChannelListener";
import {SocketPacket} from "../../../Sockets/SocketPacket";
import {User} from "../../Models/User";

@injectable()
export class UserSocketListener extends SocketChannelListener {

	public middlewares(): Middleware[] {
		return [];
	}

	public channelName(): string {
		return "user:*";
	}

	public async isAuthorised(connection: SocketConnectionContract, user: User): Promise<boolean> {
		return this.channelInfo.wildcardValue === user._id.toString();
	}

	async hello(connection: SocketConnectionContract, user: User, packet: SocketPacket): Promise<any> {
		Log.success('GREAT SUCCESS HIGH FIVE');

		connection.send('hello', {message : 'Fuck yeah from ' + user._id});
	}


}
