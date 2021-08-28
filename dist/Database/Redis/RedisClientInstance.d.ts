import { RedisClient } from "redis";
export declare class RedisClientInstance {
    private _client;
    private _config;
    constructor(config: any);
    /**
     * Setup and prepare the redis connection
     */
    private setup;
    /**
     * Get the instance of the class
     *
     * @returns {RedisClientInstance}
     */
    static get(): RedisClientInstance;
    /**
     * Is redis enabled/disabled in the configuration?
     *
     * @returns {boolean}
     */
    static isEnabled(): boolean;
    /**
     * Get the underlying redis client instance
     *
     * @returns {RedisClient}
     */
    static client(): RedisClient;
}
