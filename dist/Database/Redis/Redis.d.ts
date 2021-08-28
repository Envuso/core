import { RedisClient } from 'redis';
import { DateTime } from "../../Common";
export declare class Redis {
    private asyncOperations;
    private client;
    constructor(client: RedisClient);
    static getInstance(): Redis;
    /**
     * Get the underlying redis client
     *
     * @returns {RedisClient}
     */
    static client(): RedisClient;
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
    static put(key: string, value: any, ttl?: DateTime): Promise<boolean>;
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
    put(key: string, value: any, ttl?: DateTime): Promise<boolean>;
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
    static get<T>(key: string, _default?: any): Promise<T>;
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
    get<T>(key: string, _default?: any): Promise<T>;
    /**
     * Delete an entry from redis by it's key
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    static remove(key: string): Promise<boolean>;
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
    static has(key: string): Promise<boolean>;
    /**
     * Check if x key is stored in redis.
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    has(key: string): Promise<boolean>;
}
