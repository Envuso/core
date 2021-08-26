import { MongoClientOptions } from "mongodb";
import { ClientOpts } from "redis";
import { DatabaseSeeder } from "../Database";
export interface MongoConnectionConfiguration {
    name: string;
    url: string;
    clientOptions: MongoClientOptions;
}
export interface RedisConnectionConfiguration extends ClientOpts {
    enabled: boolean;
}
export interface DatabaseConfiguration {
    mongo: MongoConnectionConfiguration;
    redis: RedisConnectionConfiguration;
    seeder: new () => DatabaseSeeder;
}
declare const _default: DatabaseConfiguration;
export default _default;
