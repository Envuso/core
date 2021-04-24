import {init} from "node-cache-redis";
import {App, ServiceProvider} from "../AppContainer";


export class CacheServiceProvider extends ServiceProvider {

	async register(app: App, config) {

		const defaultConfiguration = {
			prefix : "envuso-app-cache",
			host   : '127.0.0.1',
			port   : 9379,
		};

		init(config.get('database.redis', defaultConfiguration));

	}

	async boot() {}

}
