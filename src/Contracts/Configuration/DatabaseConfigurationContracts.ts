import {MongoClientOptions} from "mongodb";
import {DatabaseSeederContract} from "../Database/Seeder/DatabaseSeederContract";

export interface MongoConnectionConfiguration {
	name: string;
	url: string;
	clientOptions: MongoClientOptions;
}

export interface DatabaseConfiguration {
	mongo: MongoConnectionConfiguration;
	seeder?: new () => DatabaseSeederContract
}
