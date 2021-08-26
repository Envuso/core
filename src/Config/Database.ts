import {MongoClientOptions} from "mongodb";
import {ClientOpts} from "redis";

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
}

export default {

	mongo : {
		name          : 'test',
		url           : 'mongodb://127.0.0.1:27017',
		clientOptions : {
			ssl                : false,
			readPreference     : "primaryPreferred",
			useNewUrlParser    : true,
			useUnifiedTopology : true
		}
	},

	redis : {
		/**
		 * Set this to false to disable redis integration
		 */
		enabled : true,

		prefix : 'envuso-',
		//		db     : 'default',
		host : '127.0.0.1',
		port : 6379,
	}

} as DatabaseConfiguration;
