import {RedisClient} from "redis";
import {DateTime} from "../../../Common";
import {DateTimeContract} from "../../Common/Utility/DateTimeContract";

export interface RedisContract {
	asyncOperations: { set: any; get: any; exists: any; del: any };
	client: RedisClient;

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
	put(key: string, value: any, ttl?: DateTimeContract): Promise<boolean>;

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
	get<T>(key: string, _default: any): Promise<T>;

	/**
	 * Delete an entry from redis by it's key
	 *
	 * @param {string} key
	 * @returns {Promise<boolean>}
	 */
	remove(key: string): Promise<boolean>;

	/**
	 * Check if x key is stored in redis.
	 *
	 * @param {string} key
	 * @returns {Promise<boolean>}
	 */
	has(key: string): Promise<boolean>;
}
