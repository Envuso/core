import {App, ConfigRepository, ServiceProvider} from "@envuso/app";
import {Server} from "./Server";

export class ServerServiceProvider extends ServiceProvider {

	async register(app: App, config: ConfigRepository) {
		app.container().registerSingleton<Server>(Server);
	}

	async boot(app: App, config: ConfigRepository) {

	}


}
