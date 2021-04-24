import { RedisClient } from 'redis';
export declare class Redis {
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
     * @param key
     * @param value
     * @returns {any}
     */
    static put(key: any, value: any): any;
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
    static get<T>(key: any, _default?: any): Promise<T>;
    /**
     * Delete an entry from redis by it's key
     *
     * @param {string} key
     * @returns {any}
     */
    static remove(key: string): any;
}
