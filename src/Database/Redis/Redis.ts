import {RedisClient} from 'redis';
import {promisify} from "util";
import {RedisClientInstance} from "./RedisClientInstance";


export class Redis {

	/**
	 * Get the underlying redis client
	 *
	 * @returns {RedisClient}
	 */
	public static client(): RedisClient {
		return RedisClientInstance.client();
	}

	/**
	 * Set a value using promises rather than callbacks
	 *
	 * We JSON.stringify the value so that hopefully you
	 * will get the same type returned.
	 *
	 * @param key
	 * @param value
	 * @returns {any}
	 */
	public static put(key, value: any) {
		if(!RedisClientInstance.isEnabled()) {
			return;
		}

		const setAsync = promisify(RedisClientInstance.client().set).bind(RedisClientInstance.client());

		return setAsync(key, JSON.stringify({value : value}));
	}

	/**
	 * Get a value from the redis store using promises
	 *
	 * You can specify a default value, so that if your value doesn't exist
	 * it can fallback to the value you specified.
	 *
	 * @param key
	 * @param {null} _default
	 * @returns {Promise<T>}
	 */
	public static async get<T>(key, _default: any = null): Promise<T> {
		if(!RedisClientInstance.isEnabled()) {
			return null;
		}

		const getAsync = promisify(RedisClientInstance.client().get).bind(RedisClientInstance.client());

		let value = await getAsync(key);

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
	 * @returns {any}
	 */
	public static remove(key: string) {
		if(!RedisClientInstance.isEnabled()) {
			return;
		}

		const delAsync = promisify(RedisClientInstance.client().del).bind(RedisClientInstance.client());

		return delAsync(key);
	}

}
