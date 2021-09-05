import redis, {RedisClient} from "redis";
import {Log} from "../../Common";
import {RedisConnectionConfiguration} from "../../Contracts/Configuration/DatabaseConfigurationContracts";
import {Redis} from "./Redis";

let instance = null;

export class RedisClientInstance {
	private _client: RedisClient | null;
	private _config: RedisConnectionConfiguration;

	constructor(config : any) {
		if(instance) return;

		const defaultConfiguration = {
			enabled : false,
			prefix  : 'envuso-',
			db      : 'default',
			host    : '127.0.0.1',
			port    : 6379,
		};

		this._config = config ?? defaultConfiguration;

		this.setup();

		instance = this;
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

		new Redis(this._client);
	}

	/**
	 * Get the instance of the class
	 *
	 * @returns {RedisClientInstance}
	 */
	static get(): RedisClientInstance {
		return instance;
	}

	/**
	 * Is redis enabled/disabled in the configuration?
	 *
	 * @returns {boolean}
	 */
	static isEnabled() {
		return this.get()._config.enabled;
	}

	/**
	 * Get the underlying redis client instance
	 *
	 * @returns {RedisClient}
	 */
	static client(): RedisClient {
		return this.get()._client;
	}
}
