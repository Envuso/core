import {WebSocketConnectionContract} from "../../../Contracts/WebSockets/WebSocketConnectionContract";
import {Middleware} from "../../../Routing";
import {injectable} from "tsyringe";
import {Log} from "../../../Common";
import {UserMessageSocketPacket} from "../../../WebSockets/SocketEventTypes";
import {WebSocketChannelListener} from "../../../WebSockets/WebSocketChannelListener";
import {WebSocketConnection} from "../../../WebSockets/WebSocketConnection";
import {User} from "../../Models/User";

@injectable()
export class PublicSocketListener extends WebSocketChannelListener {

	public middlewares(): Middleware[] {
		return [];
	}

	public channelName(): string {
		return "public";
	}

	public async isAuthorised(connection: WebSocketConnection<User>): Promise<boolean> {
		return true;
	}

	async hello(connection: WebSocketConnectionContract<any>, packet: UserMessageSocketPacket): Promise<any> {
		Log.success('GREAT SUCCESS HIGH FIVE');

		//		this.send('hello', {message : 'uwot'});

		this.broadcast('hello', {message : 'uwot'});
	}


}
