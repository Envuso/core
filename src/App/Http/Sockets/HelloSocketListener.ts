import {SocketConnection} from "../../../Sockets/SocketConnection";
import {SocketListener} from "../../../Sockets/SocketListener";

export class HelloSocketListener extends SocketListener {

	eventName(): string {
		return "hello-world";
	}

	async handle(connection: SocketConnection): Promise<any> {

		connection.send('hello-world-received', {message : 'yeet'});

	}

}
