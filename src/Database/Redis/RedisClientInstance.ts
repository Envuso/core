import redis, {RedisClient} from "redis";
import {ConfigRepository, resolve} from "../../AppContainer";
import {Log} from "../../Common";
import {RedisConnectionConfiguration} from "../../Config/Database";

let instance = null;

export class RedisClientInstance {
	private _client: RedisClient | null;
	private _config: RedisConnectionConfiguration;

	constructor() {
		const defaultConfiguration = {
			enabled : false,
			prefix  : 'envuso-',
			db      : 'default',
			host    : '127.0.0.1',
			port    : 6379,
		};

		this._config = resolve(ConfigRepository).get(
			'database.redis', defaultConfiguration
		);

		this.setup();
	}

	/**
	 * Setup and prepare the redis connection
	 */
	private setup() {
		if (!this._config.enabled) {
			this._client = null;
			return;
		}

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

	static isEnabled() {
		return this.get()._config.enabled;
	}

	static client() {
		return this.get()._client;
	}
}
