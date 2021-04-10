import "reflect-metadata";
import constructor from "tsyringe/dist/typings/types/constructor";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import { ConfigRepository } from "./Config/ConfigRepository";
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
    constructor();
    /**
     * Get an instance of the app
     */
    static getInstance(): App;
    /**
     * Boot up the App and bind our Config
     * Once called, we'll be able to access the app instance via {@see getInstance()}
     */
    static bootInstance(): Promise<App>;
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
    resolve<T>(key: constructor<T> | string): T;
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
}
