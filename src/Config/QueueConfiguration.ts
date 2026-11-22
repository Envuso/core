import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import Environment from "../AppContainer/Config/Environment";
import type {ServiceProviderContract} from "../Contracts/AppContainer/ServiceProviderContract";
import type {QueueConfiguration as QueueConfig} from "../Contracts/Configuration/QueueConfigurationContracts";
import {EncryptionServiceProvider} from "../Crypt/EncryptionServiceProvider";
import {DatabaseServiceProvider} from "../Database/DatabaseServiceProvider";
import {RedisServiceProvider} from "../Redis/RedisServiceProvider";
import {StorageServiceProvider} from "../Storage/StorageServiceProvider";

export default class QueueConfiguration extends ConfigurationCredentials implements QueueConfig {
	name = 'queue';

	/**
	 * Worker threads that process jobs. Set to 0 in processes that should only dispatch.
	 */
	workers = Number(Environment.get('QUEUE_WORKERS', 1));

	waitTimeMs = 1_000;

	/**
	 * Running jobs keep their reservation alive; if the process dies, its jobs
	 * are retried after this long.
	 */
	visibilityTimeoutMs = 5 * 60_000;

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
