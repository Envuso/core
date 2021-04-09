import "reflect-metadata";
import { ConfigRepository } from "@src/Config/ConfigRepository";
import { FailedToBindException } from "@src/Exceptions/FailedToBindException";
import { ServiceProvider } from "@src/ServiceProvider";
import path from 'path';
import { container } from "tsyringe";
let instance = null;
export class App {
    constructor() {
        /**
         * Once we've called {@see bootInstance} this will be true
         *
         * @private
         */
        this._booted = false;
        this._container = container;
    }
    /**
     * Get an instance of the app
     */
    static getInstance() {
        if (!instance)
            throw new Error('App was not booted yet. Please call "await App.bootInstance()" first.');
        return instance;
    }
    /**
     * Boot up the App and bind our Config
     * Once called, we'll be able to access the app instance via {@see getInstance()}
     */
    static async bootInstance() {
        if (instance)
            return instance;
        const app = new App();
        await app.boot();
        instance = app;
        return app;
    }
    /**
     * Load any base Config/services we need
     */
    async boot() {
        if (this._booted)
            return;
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
    bind(binder, bindAs) {
        const result = binder(this, this.resolve(ConfigRepository));
        if (!result?.constructor) {
            throw new FailedToBindException(result);
        }
        if (result instanceof ServiceProvider) {
            this._container.register('ServiceProvider', { useValue: result });
            return;
        }
        this._container.register(bindAs ?? result.constructor.name, { useValue: result });
    }
    /**
     * Get the container instance
     */
    container() {
        return this._container;
    }
    /**
     * Get a service from the container
     *
     * @param key
     */
    resolve(key) {
        return this.container().resolve(key);
    }
    /**
     * Load any configuration defined in the
     * app and set the paths for our app
     *
     * @private
     */
    async prepareConfiguration() {
        this._container.registerSingleton(ConfigRepository);
        const configRepository = this._container.resolve(ConfigRepository);
        const cwd = process.cwd();
        const paths = {
            root: cwd,
            src: path.join(cwd, 'src'),
            config: path.join(cwd, 'Config'),
            controllers: path.join(cwd, 'src', 'App', 'Http', 'Controllers'),
        };
        await configRepository.loadConfigFrom(paths.config);
        configRepository.set('paths', paths);
    }
    /**
     * Will load all service providers from the app config
     */
    async loadServiceProviders() {
        const providers = this.resolve(ConfigRepository).get('app.providers');
        if (!providers) {
            throw new Error('No service providers found.');
        }
        for (let providerClass of providers) {
            const provider = new providerClass();
            await provider.register(this, this.resolve(ConfigRepository));
            console.log('Service provider registered: ', provider.constructor.name);
        }
        const serviceProviders = this._container.resolveAll('ServiceProvider');
        for (let provider of serviceProviders) {
            console.log('Service provider booted: ', provider.constructor.name);
            await provider.boot(this, this.resolve(ConfigRepository));
        }
    }
}
//# sourceMappingURL=App.js.map