import redis from "redis";
export declare class RedisClientInstance {
    private _client;
    private _config;
    constructor();
    /**
     * Setup and prepare the redis connection
     */
    private setup;
    static get(): RedisClientInstance;
    static isEnabled(): boolean;
    static client(): redis.RedisClient;
}
