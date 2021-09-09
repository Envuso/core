import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {ServiceProviderContract} from "../Contracts/AppContainer/ServiceProviderContract";
import {QueueConfiguration as QueueConfig} from "../Contracts/Configuration/QueueConfigurationContracts";
import {EncryptionServiceProvider} from "../Crypt";
import {DatabaseServiceProvider} from "../Database";
import {RedisServiceProvider} from "../Redis/RedisServiceProvider";
import {StorageServiceProvider} from "../Storage";

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
