import InjectionToken from "tsyringe/dist/typings/providers/injection-token";
import {ServiceProvider} from "../../AppContainer";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {ExceptionHandlerConstructorContract} from "../Common/Exception/ExceptionHandlerContract";
import {ConfigRepositoryContract} from "./Config/ConfigRepositoryContract";
import {ServiceProviderContract} from "./ServiceProviderContract";

export interface BaseConfiguration {
	config: { [key: string]: any };
}

export interface MetaGeneratorConfiguration {
	typescriptTypes: boolean;
	json: boolean;
	location?: string;
	fileName?: string;
}

export type LogTypes = {
	middleware?: boolean;
	routes?: boolean;
	controllers?: boolean;
	providers?: boolean;
	serverHooks?: boolean;
	socketInformation?: boolean;
	socketChannels?: boolean;
}

export interface ApplicationConfiguration {
	environment: string;
	appKey: string;
	url: string;
	providers: (new () => ServiceProviderContract)[];
	exceptionHandler: ExceptionHandlerConstructorContract,
	logging: LogTypes;
}

export interface AppContract {

	/**
	 * Bind a service to the container
	 *
	 * @param binder
	 * @param bindAs | Allows you to over-ride the key used to identify this instance in the
	 *               | container, by default it will use constructor.name
	 *               | This does not apply to classes that extend ServiceProvider
	 */
	bind(binder: (app: AppContract, config: ConfigRepositoryContract) => any, bindAs?: string): void;

	/**
	 * Get the container instance
	 */
	container(): DependencyContainer;

	/**
	 * Get a service from the container
	 *
	 * @param key
	 */
	resolve<T>(key: InjectionToken<T>): T;

	/**
	 * Get all services from the container by the specified key
	 *
	 * @param key
	 */
	resolveAll<T>(key: InjectionToken<T>): T[];

	/**
	 * Will load all service providers from the app config
	 */
	loadServiceProviders(withoutServiceProviders?: (new () => ServiceProvider)[], isForQueueWorker?: boolean): Promise<void>;

	/**
	 * Will run the "unload" method on all registered service providers
	 *
	 * @returns {Promise<void>}
	 */
	unloadServiceProviders(): Promise<void>;

	/**
	 * Get the app config repository a little easier
	 */
	config(): ConfigRepositoryContract;

	/**
	 * This will clear the container and allow the app to be booted again
	 *
	 * Basically, this shouldn't really need to be used in regular app logic
	 * You're probably doing something wrong if you find the need to use it there...
	 *
	 * The reason this exists is so that when writing tests, you can start from a clean slate.
	 */
	unload(): Promise<void>;
}
