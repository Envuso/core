import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {ServiceProviderContract} from "../Contracts/AppContainer/ServiceProviderContract";

export abstract class ServiceProvider implements ServiceProviderContract {

	/**
	 * Register any services to the container
	 */
	public abstract register(app: AppContract, config: ConfigRepositoryContract): Promise<void>;

	/**
	 * Should not be used to bind any services to the container
	 * This method will have access to all other services,
	 * since it has been called after register()
	 */
	public abstract boot(app: AppContract, config: ConfigRepositoryContract): Promise<void>;

	/**
	 * This method will be run when the server is unloading
	 * Typically in tests, or other cases.
	 *
	 * This is typically a way to "clean-up" what your service-provider registered
	 *
	 * @param {AppContract} app
	 * @param {ConfigRepositoryContract} config
	 */
	public unload(app: AppContract, config: ConfigRepositoryContract) {

	}
}
