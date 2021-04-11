import { MongoClientOptions } from "mongodb";
import { Logger } from "node-cache-redis/dist/src/helpers";
import { ClientOpts as RedisOptions } from "redis";
import { Options as PoolOptions } from 'generic-pool';
export interface RedisDatabaseConfiguration {
    name?: string | undefined;
    redisOptions: RedisOptions;
    poolOptions?: PoolOptions | undefined;
    logger?: Logger | undefined;
    defaultTtlInS?: number | undefined;
}
export interface MongoConnectionConfiguration {
    name: string;
    url: string;
    clientOptions: MongoClientOptions;
}
declare const _default: {
    mongo: MongoConnectionConfiguration;
    redis: RedisDatabaseConfiguration;
};
export default _default;
