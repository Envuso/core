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
    static client(): redis.RedisClient;
}
