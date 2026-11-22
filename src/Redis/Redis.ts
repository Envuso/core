import {DateTime} from "@envuso/date-time-helper";
import {RedisClient} from "bun";
import {Log} from "../Common/Logger/Log";
import Obj from "../Common/Utility/Obj";

export interface RedisConnectionOptions {
	/** Full connection url, e.g. redis://:password@host:6379/0. Takes priority over host/port/password/db */
	url?: string;
	host?: string;
	port?: number;
	password?: string | null;
	db?: number;
	/** Prepended to every key used through this wrapper */
	keyPrefix?: string;
	tls?: boolean;
}

let instance: Redis = null;

export class Redis {
	private readonly config: RedisConnectionOptions;
	private client: RedisClient;

	constructor(config: RedisConnectionOptions) {
		if (instance) {
			return instance;
		}

		this.config = config;
		instance    = this;
	}

	public static connectionUrl(config: RedisConnectionOptions): string {
		if (config.url) {
			return config.url;
		}

		const auth = config.password ? `:${encodeURIComponent(config.password)}@` : '';
		const host = config.host || '127.0.0.1';
		const port = config.port || 6379;

		return `${config.tls ? 'rediss' : 'redis'}://${auth}${host}:${port}/${config.db ?? 0}`;
	}

	public async connect() {
		if (this.client) {
			return;
		}

		this.client         = new RedisClient(Redis.connectionUrl(this.config), {tls : this.config.tls});
		this.client.onclose = (error) => {
			if (error) {
				Log.exception("Redis connection closed:", error);
			}
		};

		await this.client.connect();
	}

	public getClient(): RedisClient {
		return this.client;
	}

	public static getInstance(): Redis {
		return instance;
	}

	public static async shutdown() {
		const didQuit = !!instance?.client;

		instance?.client?.close();
		instance = null;

		return didQuit;
	}

	/**
	 * Apply the configured key prefix
	 */
	public key(key: string): string {
		return (this.config.keyPrefix ?? '') + key;
	}

	/**
	 * Run a Lua script. Keys are prefixed automatically; args are passed as-is.
	 */
	public eval<T = any>(lua: string, keys: string[], args: (string | number)[] = []): Promise<T> {
		return this.client.eval(lua, keys.length, ...keys.map(k => this.key(k)), ...args);
	}

	/*
	 Basic
	 */

	/**
	 * Set a value. The value is JSON encoded, so you get the same type back from get().
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {DateTime|undefined} ttl | A datetime in the future when this key should expire.
	 */
	public static set(key: string, value: any, ttl?: DateTime): Promise<boolean> {
		return this.getInstance().set(key, value, ttl);
	}

	public async set(key: string, value: any, ttl?: DateTime): Promise<boolean> {
		const redisValue = JSON.stringify({value : value});

		if (ttl !== undefined && ttl !== null) {
			// EX must be positive; a ttl in the past expires (almost) immediately
			const seconds = Math.max(1, Math.ceil(DateTime.diffInSeconds(ttl)));

			return await this.client.set(this.key(key), redisValue, "EX", seconds) === "OK";
		}

		return await this.client.set(this.key(key), redisValue) === "OK";
	}

	/**
	 * Get a value, or `_default` when it doesn't exist.
	 */
	public static get<T>(key: string, _default: any = null): Promise<T> {
		return this.getInstance().get(key, _default);
	}

	public async get<T>(key: string, _default: any = null): Promise<T> {
		const rawValue = await this.client.get(this.key(key));

		if (Obj.isNullOrUndefined(rawValue)) {
			return _default;
		}

		const {value} = JSON.parse(rawValue);

		return value;
	}

	/**
	 * Delete an entry by its key
	 */
	public static remove(key: string): Promise<boolean> {
		return this.getInstance().remove(key);
	}

	public async remove(key: string): Promise<boolean> {
		return (await this.client.del(this.key(key))) === 1;
	}

	/**
	 * Check if the key exists
	 */
	public static has(key: string): Promise<boolean> {
		return this.getInstance().has(key);
	}

	public has(key: string): Promise<boolean> {
		return this.client.exists(this.key(key));
	}

	/*
	 Sorted Set
	 */

	public static zAdd(key: string, score: number, value: string): Promise<boolean> {
		return this.getInstance().zAdd(key, score, value);
	}

	public async zAdd(key: string, score: number, value: string): Promise<boolean> {
		return await this.client.zadd(this.key(key), score, value) === 1;
	}

	/*
	 List
	 */

	public static lRange(key: string, min: number, max: number): Promise<string[]> {
		return this.getInstance().lRange(key, min, max);
	}

	public lRange(key: string, min: number, max: number): Promise<string[]> {
		return this.client.lrange(this.key(key), min, max);
	}

	public static push(key: string, data: string): Promise<boolean> {
		return this.getInstance().push(key, data);
	}

	public async push(key: string, data: string): Promise<boolean> {
		return await this.client.lpush(this.key(key), data) > 0;
	}

	public static pushToEnd(key: string, data: string): Promise<boolean> {
		return this.getInstance().pushToEnd(key, data);
	}

	public async pushToEnd(key: string, data: string): Promise<boolean> {
		return await this.client.rpush(this.key(key), data) > 0;
	}

	public static lRemove(key: string, count: number, member: string): Promise<boolean> {
		return this.getInstance().lRemove(key, count, member);
	}

	public async lRemove(key: string, count: number, member: string): Promise<boolean> {
		return await this.client.lrem(this.key(key), count, member) > 0;
	}
}

export default Redis;
