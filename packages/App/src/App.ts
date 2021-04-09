import "reflect-metadata";

import path from 'path';
import {container} from "tsyringe";
import constructor from "tsyringe/dist/typings/types/constructor";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {ConfigRepository} from "./Config/ConfigRepository";
import {FailedToBindException} from "./Exceptions/FailedToBindException";
import {ServiceProvider} from "./ServiceProvider";

let instance: App | null = null;

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

	constructor() {
		this._container = container;
	}

	/**
	 * Get an instance of the app
	 */
	static getInstance(): App {
		if (!instance)
			throw new Error('App was not booted yet. Please call "await App.bootInstance()" first.')

		return instance;
	}

	/**
	 * Boot up the App and bind our Config
	 * Once called, we'll be able to access the app instance via {@see getInstance()}
	 */
	static async bootInstance(): Promise<App> {
		if (instance) return instance;

		const app = new App();
		await app.boot();

		instance = app;

		return app;
	}

	/**
	 * Load any base Config/services we need
	 */
	async boot() {
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
	resolve<T>(key: constructor<T>|string) {
		return this.container().resolve<T>(key);
	}

	/**
	 * Load any configuration defined in the
	 * app and set the paths for our app
	 *
	 * @private
	 */
	private async prepareConfiguration() {
		this._container.registerSingleton(ConfigRepository);

		const configRepository = this._container.resolve(ConfigRepository)

		const cwd   = process.cwd();
		const paths = {
			root        : cwd,
			src         : path.join(cwd, 'src'),
			config      : path.join(cwd, 'Config'),
			controllers : path.join(cwd, 'src', 'App', 'Http', 'Controllers'),
		}

		await configRepository.loadConfigFrom(paths.config);

		configRepository.set('paths', paths);
	}

	/**
	 * Will load all service providers from the app config
	 */
	async loadServiceProviders() {
		type Provider = (constructor<ServiceProvider>)

		const providers = this.resolve(ConfigRepository).get<Array<Provider>>('app.providers');

		if(!providers){
			throw new Error('No service providers found.');
		}

		for (let providerClass of providers) {
			const provider = new providerClass();

			await provider.register(
				this, this.resolve(ConfigRepository)
			);
			console.log('Service provider registered: ', provider.constructor.name)
		}

		const serviceProviders = this._container.resolveAll<ServiceProvider>('ServiceProvider');

		for (let provider of serviceProviders) {
			console.log('Service provider booted: ', provider.constructor.name)

			await provider.boot(
				this, this.resolve(ConfigRepository)
			);
		}
	}
}
