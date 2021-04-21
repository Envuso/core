import {init} from "node-cache-redis";
import {App, ServiceProvider} from "../../AppContainer";
import {RedisDatabaseConfiguration} from "../../Config/Database";


export class CacheServiceProvider extends ServiceProvider {

	async register(app: App, config) {

		const defaultConfiguration: RedisDatabaseConfiguration = {
			name         : "app_cache",
			redisOptions : {
				host : '127.0.0.1',
				port : 9379,
			}
		};

		init(config.get('database.redis', defaultConfiguration));

	}

	async boot() {}

}
