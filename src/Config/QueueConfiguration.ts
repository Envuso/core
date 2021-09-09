import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {QueueConfiguration as QueueConfig} from "../Contracts/Configuration/QueueConfigurationContracts";

export default class QueueConfiguration extends ConfigurationCredentials implements QueueConfig {
	emptyWaitTimeMs = 1_000;
	fullWaitTimeMs = 10;
}
