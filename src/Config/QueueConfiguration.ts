import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import type {ServiceProviderContract} from "../Contracts/AppContainer/ServiceProviderContract";
import type {QueueConfiguration as QueueConfig} from "../Contracts/Configuration/QueueConfigurationContracts";
import {EncryptionServiceProvider} from "../Crypt/EncryptionServiceProvider";
import {DatabaseServiceProvider} from "../Database/DatabaseServiceProvider";
import {RedisServiceProvider} from "../Redis/RedisServiceProvider";
import {StorageServiceProvider} from "../Storage/StorageServiceProvider";

export default class QueueConfiguration extends ConfigurationCredentials implements QueueConfig {
	waitTimeMs = 1_000;

	/**
	 * Service providers to load into the container with your queue workers
	 *
	 * Without these defined/loaded, you won't have access to things
	 * like the database, file storage, redis, etc...
	 *
	 * @type {{new(): ServiceProviderContract}[]}
	 */
	providers: (new () => ServiceProviderContract)[] = [
		DatabaseServiceProvider,
		RedisServiceProvider,
		EncryptionServiceProvider,
		StorageServiceProvider,
	];
}
