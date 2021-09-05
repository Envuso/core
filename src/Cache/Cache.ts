import {DateTime} from "../Common";
import {DateTimeContract} from "../Contracts/Common/Utility/DateTimeContract";
import {Redis} from "../Database";


export class Cache {

	/**
	 * Get a value from the redis cache
	 *
	 * @param {string} key
	 * @param _default
	 * @returns {Promise<T>}
	 */
	public static get<T>(key: string, _default: any = null): Promise<T> {
		return Redis.get<T>(`redis-cache.${key}`, _default);
	}

	/**
	 * Put a value into the redis cache
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {DateTime|undefined} ttl | A datetime instance of a date in the future when this key should expire.
	 * @returns {Promise<boolean>}
	 */
	public static put(key: string, value: any): Promise<boolean> ;
	public static put(key: string, value: any, ttl: DateTimeContract): Promise<boolean> ;
	public static put(key: string, value: any, ttl: DateTime = undefined): Promise<boolean> {
		return Redis.put(`redis-cache.${key}`, value, ttl);
	}

	/**
	 * Remove an item from the redis cache
	 *
	 * @param {string} key
	 * @returns {Promise<boolean>}
	 */
	public static remove(key: string): Promise<boolean> {
		return Redis.remove(`redis-cache.${key}`);
	}

	/**
	 * Check if an item exists in the redis cache
	 *
	 * @param {string} key
	 * @returns {Promise<boolean>}
	 */
	public static has(key: string): Promise<boolean> {
		return Redis.has(`redis-cache.${key}`);
	}

	/**
	 * Allows us to handle all of the checking around caching a value/getting a value.
	 * If our key exists already, it will be returned
	 * If it doesn't, our callback will be called, the value of the callback will
	 * be inserted into the cache, then the value returned.
	 *
	 * It allows us to do simpler caching;
	 * const users = Cache.remember('users', async () => await User.get(), DateTime.now().addHours(2));
	 *
	 * In this case, if 'users' key doesn't exist in the cache, we'll get all our users from
	 * the database, insert them to the cache, then return the value
	 * However... if they do exist in the cache, it will just return us the users
	 *
	 * @param {string} key
	 * @param {() => Promise<T>} callback
	 * @param {DateTime|undefined} ttl
	 * @returns {Promise<T>}
	 */
	public static async remember<T>(key: string, callback: () => Promise<T>, ttl?: DateTime) {
		if (await this.has(key)) {
			return await this.get<T>(key);
		}

		await this.put(key, await callback(), ttl);

		return await this.get<T>(key);
	}
}
