import RedisClient, {Redis as IRedis, RedisOptions} from "ioredis";
import {Log, DateTime} from "../Common";
import Obj from "../Common/Utility/Obj";

let instance: Redis = null;

export class Redis {
	private readonly config: RedisOptions;
	private client: IRedis;

	constructor(config: RedisOptions) {
		if (instance) {
			return instance;
		}

		this.config = config;
		instance = this;
	}

	public connect() {
		if (this.client) {
			return;
		}

		this.client = new RedisClient(this.config);
		this.client.on("error", (error) => Log.exception("Redis Error:", error));
	}

	public getClient() {
		return this.client;
	}

	public static getInstance(): Redis {
		return instance;
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
	public static set(key: string, value: any, ttl?: DateTime): Promise<boolean> {
		return this.getInstance().set(key, value, ttl);
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
	public async set(key: string, value: any, ttl?: DateTime): Promise<boolean> {
		const redisValue = JSON.stringify({value: value});

		if (ttl !== undefined) {
			return await this.client.set(
				key, redisValue,
				"EX", DateTime.diffInSeconds(ttl),
			) === "OK";
		}

		return await this.client.set(
			key, redisValue,
		) === "OK";
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
	public static get<T>(key: string, _default: any = null): Promise<T> {
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
		const rawValue = await this.client.get(key);

		if (Obj.isNullOrUndefined(rawValue)) {
			return _default;
		}

		const {value} = JSON.parse(rawValue);

		return value;
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
		return (await this.client.del(key)) === 1;
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
		return await this.client.exists(key) === 1;
	}

	public static zAdd(key: string, score: number, value: string): Promise<boolean> {
		return this.getInstance().zAdd(key, score, value);
	}

	public async zAdd(key: string, score: number, value: string): Promise<boolean> {
		return await this.client.zadd(key, score, value) === 1;
	}
}

export default Redis;
