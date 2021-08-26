import {init} from "node-cache-redis";
import {App, ServiceProvider} from "../AppContainer";

export class CacheServiceProvider extends ServiceProvider {

	async register(app: App, config) {

		const enabled = config.get('database.redis.enabled', false);

		if (!enabled) {
			return;
		}

		const redisConfig = config.get('database.redis', {
			prefix : "envuso-app-cache",
			host   : '127.0.0.1',
			port   : 9379,
		});


		init(redisConfig);

	}

	async boot() {}

}
