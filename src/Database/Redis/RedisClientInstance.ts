import redis, {RedisClient} from "redis";
import {ConfigRepository, resolve} from "../../AppContainer";
import {Log} from "../../Common";

let instance = null;

export class RedisClientInstance {
	private _client: RedisClient;
	private _config: any;

	constructor() {
		const defaultConfiguration = {
			prefix : 'envuso-',
			db     : 'default',
			host   : '127.0.0.1',
			port   : 6379,
		};

		this._config = resolve(ConfigRepository)
			.get('database.redis', defaultConfiguration);

		this.setup();
	}

	/**
	 * Setup and prepare the redis connection
	 */
	private setup() {
		this._client = redis.createClient(this._config);

		this._client.on("error", (error) => {
			Log.exception('Redis Error: ', error);
		});
	}

	static get(): RedisClientInstance {
		if (instance) return instance;

		instance = new this();

		return instance;
	}

	static client() {
		return this.get()._client;
	}
}
