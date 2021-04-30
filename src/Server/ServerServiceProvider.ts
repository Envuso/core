import {App, ConfigRepository, ServiceProvider} from "../AppContainer";
import {Server} from "./Server";
import {SocketServer} from "../Sockets/SocketServer";

export class ServerServiceProvider extends ServiceProvider {

	async register(app: App, config: ConfigRepository) {
		app.container().registerSingleton<Server>(Server);
		app.container().registerSingleton<SocketServer>(SocketServer);
	}

	async boot(app: App, config: ConfigRepository) {

	}


}
