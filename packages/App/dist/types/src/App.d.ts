import "reflect-metadata";
import { ConfigRepository } from "@src/Config/ConfigRepository";
import constructor from "tsyringe/dist/typings/types/constructor";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
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
    boot(): Promise<void>;
    /**
     * Bind a service to the container
     *
     * @param binder
     */
    bind(binder: (app: App, config: ConfigRepository) => any): void;
    /**
     * Get the container instance
     */
    container(): DependencyContainer;
    /**
     * Get a service from the container
     *
     * @param key
     */
    resolve<T>(key: constructor<T>): T;
    /**
     * Load any configuration defined in the
     * app and set the paths for our app
     *
     * @private
     */
    private prepareConfiguration;
}
