import {App} from "@src/App";
import {ConfigRepository} from "@src/Config/ConfigRepository";

export abstract class ServiceProvider {

	/**
	 * Register any services to the container
	 */
	abstract register(app : App, config : ConfigRepository): Promise<void>;

	/**
	 * Should not be used to bind any services to the container
	 * This method will have access to all other services,
	 * since it has been called after register()
	 */
	abstract boot(app : App, config : ConfigRepository): Promise<void>;

}
