import {Middleware} from "../../../Routing";
import {injectable} from "tsyringe";
import {Log} from "../../../Common";
import {AuthenticatedMiddleware} from "../../../Routing/Middleware/Middlewares/AuthenticatedMiddleware";
import {UserMessageSocketPacket} from "../../../WebSockets/SocketEventTypes";
import {WebSocketChannelListener} from "../../../WebSockets/WebSocketChannelListener";
import {WebSocketConnection} from "../../../WebSockets/WebSocketConnection";
import {User} from "../../Models/User";

@injectable()
export class UserSocketListener extends WebSocketChannelListener {

	public middlewares(): Middleware[] {
		return [
			new AuthenticatedMiddleware(),
		];
	}

	public channelName(): string {
		return "user:*";
	}

	public async isAuthorised(connection: WebSocketConnection<User>): Promise<boolean> {
		return this.channelInfo.wildcardValue === connection.user?._id?.toString();
	}

	async hello(connection: WebSocketConnection<User>, packet: UserMessageSocketPacket): Promise<any> {
		Log.success('GREAT SUCCESS HIGH FIVE');

		UserSocketListener.broadcast(connection.user._id.toString(), 'hello', {message : 'oh hi, it worked woooo'});
	}


}
