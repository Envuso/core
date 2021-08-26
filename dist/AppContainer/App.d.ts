import InjectionToken from "tsyringe/dist/typings/providers/injection-token";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import { ConfigRepository } from "./Config/ConfigRepository";
interface BaseConfiguration {
    config: {
        [key: string]: any;
    };
}
export declare class App {
    /**
     * The base container instance
     *
     * @private
     */
    private _container;
    /**
     * Once we've called {@see bootInstance} this will be true
     *
     * @private
     */
    private _booted;
    /**
     * We'll set some base configuration here so that it can be passed through
     * the boot process without having to constantly pass vars down the calls
     *
     * @private
     */
    private _baseConfiguration;
    constructor();
    /**
     * Get an instance of the app
     */
    static getInstance(): App;
    /**
     * Boot up the App and bind our Config
     * Once called, we'll be able to access the app instance via {@see getInstance()}
     */
    static bootInstance(config: BaseConfiguration): Promise<App>;
    /**
     * Load any base Config/services we need
     */
    private boot;
    /**
     * Bind a service to the container
     *
     * @param binder
     * @param bindAs | Allows you to over-ride the key used to identify this instance in the
     *               | container, by default it will use constructor.name
     *               | This does not apply to classes that extend ServiceProvider
     */
    bind(binder: (app: App, config: ConfigRepository) => any, bindAs?: string): void;
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
     * Load any configuration defined in the
     * app and set the paths for our app
     *
     * @private
     */
    private prepareConfiguration;
    /**
     * Will load all service providers from the app config
     */
    loadServiceProviders(): Promise<void>;
    /**
     * Get the app config repository a little easier
     */
    config(): ConfigRepository;
    /**
     * Is the app instance booted?
     */
    static isBooted(): boolean;
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
export {};
