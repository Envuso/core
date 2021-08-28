import { DateTime } from "../Common";
export declare class Cache {
    /**
     * Get a value from the redis cache
     *
     * @param {string} key
     * @param _default
     * @returns {Promise<T>}
     */
    static get<T>(key: string, _default?: any): Promise<T>;
    /**
     * Put a value into the redis cache
     *
     * @param {string} key
     * @param {any} value
     * @param {DateTime|undefined} ttl | A datetime instance of a date in the future when this key should expire.
     * @returns {Promise<boolean>}
     */
    static put(key: string, value: any): Promise<boolean>;
    static put(key: string, value: any, ttl: DateTime): Promise<boolean>;
    /**
     * Remove an item from the redis cache
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    static remove(key: string): Promise<boolean>;
    /**
     * Check if an item exists in the redis cache
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    static has(key: string): Promise<boolean>;
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
    static remember<T>(key: string, callback: () => Promise<T>, ttl?: DateTime): Promise<T>;
}
