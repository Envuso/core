import crypto from "crypto";
import {DateTime} from "@envuso/date-time-helper";
import type {DateTimeContract} from "@envuso/date-time-helper";
import {Redis} from "../Redis/Redis";

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
		return Redis.set(`redis-cache.${key}`, value, ttl);
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
	public static async remember<T>(key: string, callback: () => Promise<T>, ttl?: DateTime, lockTimeoutMs: number = 10_000): Promise<T> {
		const cached = await this.lookup<T>(key);
		if (cached.hit) {
			return cached.value;
		}

		// Concurrent misses in this process share one callback run
		const pending = this.inflight.get(key);
		if (pending) {
			return pending;
		}

		const work = this.computeOnce(key, callback, ttl, lockTimeoutMs)
			.finally(() => this.inflight.delete(key));

		this.inflight.set(key, work);

		return work;
	}

	private static inflight = new Map<string, Promise<any>>();

	private static readonly RELEASE_LOCK = `
		if redis.call('GET', KEYS[1]) == ARGV[1] then
			return redis.call('DEL', KEYS[1])
		end
		return 0
	`;

	/**
	 * One read: a cached null is a hit, unlike has() followed by get()
	 */
	private static async lookup<T>(key: string): Promise<{ hit: boolean, value?: T }> {
		const redis = Redis.getInstance();
		const raw   = await redis.getClient().get(redis.key(`redis-cache.${key}`));

		if (raw === null || raw === undefined) {
			return {hit : false};
		}

		return {hit : true, value : JSON.parse(raw).value};
	}

	/**
	 * Run the callback in one process at a time (across processes, via a Redis lock).
	 * Others wait for the value; if the holder takes longer than the lock timeout
	 * (or died), they compute it themselves.
	 */
	private static async computeOnce<T>(key: string, callback: () => Promise<T>, ttl: DateTime, lockTimeoutMs: number): Promise<T> {
		const redis    = Redis.getInstance();
		const lockKey  = `redis-cache-lock.${key}`;
		const token    = crypto.randomUUID();
		const deadline = Date.now() + lockTimeoutMs;

		const compute = async () => {
			const value = await callback();
			await this.put(key, value, ttl);
			return value;
		};

		while (true) {
			const acquired = await redis.getClient().send('SET', [redis.key(lockKey), token, 'PX', String(lockTimeoutMs), 'NX']);

			if (acquired === 'OK') {
				try {
					// Another process may have filled it between our miss and the lock
					const cached = await this.lookup<T>(key);
					return cached.hit ? cached.value : await compute();
				} finally {
					await redis.eval(this.RELEASE_LOCK, [lockKey], [token]);
				}
			}

			await Bun.sleep(25);

			const cached = await this.lookup<T>(key);
			if (cached.hit) {
				return cached.value;
			}

			if (Date.now() > deadline) {
				return compute();
			}
		}
	}

}
