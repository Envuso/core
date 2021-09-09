import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {QueueConfiguration as QueueConfig} from "../Contracts/Configuration/QueueConfigurationContracts";

export default class QueueConfiguration extends ConfigurationCredentials implements QueueConfig {
	waitTimeMs = 1_000;
}
