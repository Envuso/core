import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import Environment from "../AppContainer/Config/Environment";
import type {
	DatabaseConfiguration as DbConfig,
	MongoConnectionConfiguration,
} from './../Contracts/Configuration/DatabaseConfigurationContracts';

export default class DatabaseConfiguration extends ConfigurationCredentials implements DbConfig {

	mongo: MongoConnectionConfiguration = {
		name          : Environment.get<string>('DB_NAME', 'test'),
		url           : Environment.get<string>('DB_URL', 'mongodb://127.0.0.1:27017'),
		clientOptions : {
			ssl            : false,
			readPreference : "primaryPreferred",
		}
	};

	/**
	 * Your user defined seeder manager
	 * This is where you will register all of your seeder instances
	 * They will all be looped through and seeded.
	 */
	//	seeder = Seeders;
	seeder = null;
}
