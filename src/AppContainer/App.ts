//import "reflect-metadata";
import {Log} from '../Common';
import path from 'path';
import {container} from "tsyringe";
import InjectionToken from "tsyringe/dist/typings/providers/injection-token";
import constructor from "tsyringe/dist/typings/types/constructor";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {ConfigRepository} from "./Config/ConfigRepository";
import {FailedToBindException} from "./Exceptions/FailedToBindException";
import {ServiceProvider} from "./ServiceProvider";

let instance: App | null = null;

interface BaseConfiguration {
	config: { [key: string]: any };
	//	paths: { [key: string]: string };
}

export class App {

	/**
	 * The base container instance
	 *
	 * @private
	 */
	private _container: DependencyContainer;

	/**
	 * Once we've called {@see bootInstance} this will be true
	 *
	 * @private
	 */
	private _booted: boolean = false;

	/**
	 * We'll set some base configuration here so that it can be passed through
	 * the boot process without having to constantly pass vars down the calls
	 *
	 * @private
	 */
	private _baseConfiguration: BaseConfiguration = {
		config : {},
		//		paths  : {}
	};

	constructor() {
		this._container = container;
	}

	/**
	 * Get an instance of the app
	 */
	static getInstance(): App {
		if (!instance)
			throw new Error('App was not booted yet. Please call "await App.bootInstance()" first.');

		return instance;
	}

	/**
	 * Boot up the App and bind our Config
	 * Once called, we'll be able to access the app instance via {@see getInstance()}
	 */
	static async bootInstance(config: BaseConfiguration): Promise<App> {
		if (instance)
			return instance;

		const app = new App();

		app._baseConfiguration = config;

		await app.boot();

		instance = app;

		return app;
	}

	/**
	 * Load any base Config/services we need
	 */
	private async boot() {
		if (this._booted) return;

		await this.prepareConfiguration();

		this._booted = true;
	}

	/**
	 * Bind a service to the container
	 *
	 * @param binder
	 * @param bindAs | Allows you to over-ride the key used to identify this instance in the
	 *               | container, by default it will use constructor.name
	 *               | This does not apply to classes that extend ServiceProvider
	 */
	bind(binder: (app: App, config: ConfigRepository) => any, bindAs?: string) {
		const result = binder(this, this.resolve(ConfigRepository));

		if (!result?.constructor) {
			throw new FailedToBindException(result);
		}

		if (result instanceof ServiceProvider) {
			this._container.register(
				'ServiceProvider', {useValue : result}
			);

			return;
		}

		this._container.register(
			bindAs ?? result.constructor.name,
			{useValue : result}
		);
	}

	/**
	 * Get the container instance
	 */
	container(): DependencyContainer {
		return this._container;
	}

	/**
	 * Get a service from the container
	 *
	 * @param key
	 */
	resolve<T>(key: InjectionToken<T>) {
		return this.container().resolve<T>(key);
	}

	/**
	 * Get all services from the container by the specified key
	 *
	 * @param key
	 */
	resolveAll<T>(key: InjectionToken<T>) {
		return this.container().resolveAll<T>(key);
	}

	/**
	 * Load any configuration defined in the
	 * app and set the paths for our app
	 *
	 * @private
	 */
	private async prepareConfiguration() {
		this._container.registerSingleton(ConfigRepository);

		const configRepository = this._container.resolve(ConfigRepository);

		const cwd   = process.cwd();
		const paths = {
			root             : cwd,
			src              : path.join(cwd, 'src'),
			config           : path.join(cwd, 'Config', 'index.js'),
			controllers      : path.join(cwd, 'src', 'App', 'Http', 'Controllers'),
			socketListeners  : path.join(cwd, 'src', 'App', 'Http', 'Sockets'),
			eventDispatchers : path.join(cwd, 'src', 'App', 'Events', 'Dispatchers'),
			eventListeners   : path.join(cwd, 'src', 'App', 'Events', 'Listeners'),
			providers        : path.join(cwd, 'src', 'App', 'Providers'),
			models           : path.join(cwd, 'src', 'App', 'Models'),
			storage          : path.join(cwd, 'storage'),
			temp             : path.join(cwd, 'storage', 'temp'),
		};

		await configRepository.loadConfigFrom(this._baseConfiguration.config);

		configRepository.set('paths', paths);
	}

	/**
	 * Will load all service providers from the app config
	 */
	async loadServiceProviders() {
		type Provider = (constructor<ServiceProvider>)

		const providers = this.resolve(ConfigRepository).get<Array<Provider>>('app.providers');

		if (!providers) {
			throw new Error('No service providers found.');
		}

		for (let providerClass of providers) {
			const provider = new providerClass();

			this.bind(() => provider);

			await provider.register(
				this, this.resolve(ConfigRepository)
			);

			Log.info('Provider registered: ' + provider.constructor.name);
		}

		const serviceProviders = this._container.resolveAll<ServiceProvider>('ServiceProvider');

		for (let provider of serviceProviders) {

			await provider.boot(
				this, this.resolve(ConfigRepository)
			);

			Log.info('Service provider booted: ' + provider.constructor.name);
		}
	}

	/**
	 * Get the app config repository a little easier
	 */
	config(): ConfigRepository {
		return this.container().resolve<ConfigRepository>(ConfigRepository);
	}

	/**
	 * Is the app instance booted?
	 */
	static isBooted(): boolean {
		const booted = instance?._booted;

		return booted === true;
	}

	/**
	 * This will clear the container and allow the app to be booted again
	 *
	 * Basically, this shouldn't really need to be used in regular app logic
	 * You're probably doing something wrong if you find the need to use it there...
	 *
	 * The reason this exists is so that when writing tests, you can start from a clean slate.
	 */
	async unload() {
		this._booted = false;
		instance     = null;

		this.config().reset();
		this.container().clearInstances();
		this.container().reset();

		Log.warn('The app has been unloaded and is ready to be booted again.');
	}
}
