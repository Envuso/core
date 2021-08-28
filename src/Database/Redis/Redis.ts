import {RedisClient} from 'redis';
import {promisify} from "util";
import {DateTime} from "../../Common";
import {RedisClientInstance} from "./RedisClientInstance";

let instance: Redis = null;

export class Redis {

	private asyncOperations: { set: any; get: any; exists: any; del: any };
	private client: RedisClient;

	constructor(client: RedisClient) {
		if (instance) {
			return instance;
		}

		this.client = client;

		this.asyncOperations = {
			set    : promisify(this.client.set).bind(this.client),
			get    : promisify(this.client.get).bind(this.client),
			del    : promisify(this.client.del).bind(this.client),
			exists : promisify(this.client.exists).bind(this.client),
		};

		instance = this;
	}

	public static getInstance(): Redis {
		return instance;
	}

	/**
	 * Get the underlying redis client
	 *
	 * @returns {RedisClient}
	 */
	public static client(): RedisClient {
		return this.getInstance().client;
	}

	/**
	 * Set a value using promises rather than callbacks
	 *
	 * We JSON.stringify the value so that hopefully you
	 * will get the same type returned.
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {DateTime|undefined} ttl | A datetime instance of a date in the future when this key should expire.
	 *
	 * @returns {Promise<boolean>}
	 */
	public static put(key: string, value: any, ttl?: DateTime): Promise<boolean> {
		return this.getInstance().put(key, value, ttl);
	}

	/**
	 * Set a value using promises rather than callbacks
	 *
	 * We JSON.stringify the value so that hopefully you
	 * will get the same type returned.
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {DateTime|undefined} ttl | A datetime instance of a date in the future when this key should expire.
	 *
	 * @returns {Promise<boolean>}
	 */
	public async put(key: string, value: any, ttl?: DateTime): Promise<boolean> {
		if (!RedisClientInstance.isEnabled()) {
			return;
		}

		const redisValue = JSON.stringify({value : value});

		if (ttl !== undefined) {
			return await this.asyncOperations.set(
				key, redisValue,
				'EX', DateTime.diffInSeconds(ttl)
			) === 'OK';
		}

		return await this.asyncOperations.set(
			key, redisValue
		) === 'OK';
	}

	/**
	 * Get a value from the redis store using promises
	 *
	 * You can specify a default value, so that if your value doesn't exist
	 * it can fallback to the value you specified.
	 *
	 * @param {string} key
	 * @param {null} _default
	 *
	 * @returns {Promise<T>}
	 */
	public static async get<T>(key: string, _default: any = null): Promise<T> {
		return this.getInstance().get(key, _default);
	}

	/**
	 * Get a value from the redis store using promises
	 *
	 * You can specify a default value, so that if your value doesn't exist
	 * it can fallback to the value you specified.
	 *
	 * @param {string} key
	 * @param {null} _default
	 *
	 * @returns {Promise<T>}
	 */
	public async get<T>(key: string, _default: any = null): Promise<T> {
		if (!RedisClientInstance.isEnabled()) {
			return null;
		}

		let value = await this.asyncOperations.get(key);

		if (value === undefined || value === null) {
			return _default;
		}

		value = JSON.parse(value);

		return value.value;
	}

	/**
	 * Delete an entry from redis by it's key
	 *
	 * @param {string} key
	 * @returns {Promise<boolean>}
	 */
	public static remove(key: string): Promise<boolean> {
		return this.getInstance().remove(key);
	}

	/**
	 * Delete an entry from redis by it's key
	 *
	 * @param {string} key
	 * @returns {Promise<boolean>}
	 */
	public async remove(key: string): Promise<boolean> {
		if (!RedisClientInstance.isEnabled()) {
			return;
		}

		return (await this.asyncOperations.del(key)) === 1;
	}

	/**
	 * Check if x key is stored in redis.
	 *
	 * @param {string} key
	 * @returns {Promise<boolean>}
	 */
	public static has(key: string): Promise<boolean> {
		return this.getInstance().has(key);
	}

	/**
	 * Check if x key is stored in redis.
	 *
	 * @param {string} key
	 * @returns {Promise<boolean>}
	 */
	public async has(key: string): Promise<boolean> {
		if (!RedisClientInstance.isEnabled()) {
			return;
		}

		return await this.asyncOperations.exists(key) === 1;
	}

}
