import {MongoClientOptions} from "mongodb";
import {ClientOpts} from "redis";
import {DatabaseSeederContract} from "../Database/Seeder/DatabaseSeederContract";

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
	seeder?: new () => DatabaseSeederContract
}
