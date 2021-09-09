import {App} from "../AppContainer";
import {Server} from "../Server/Server";
import {ErrorHandlerFn} from "./Server/ServerContract";
import {HookContract} from "./Server/ServerHooks/HookContract";

export interface EnvusoContract {
	_app: App;
	_server: Server;
	_serverHooks: (new () => HookContract)[];

	/**
	 * Boot the core App instance, bind any service
	 * providers to the container and such.
	 */
	boot(): Promise<void>;

	/**
	 * Boot the core App instance, bind any service
	 * providers to the container and such.
	 */
	bootInWorker(): Promise<void>;

	/**
	 * We need to do the regular boot process, but with a different
	 * subset of service providers
	 *
	 * @returns {Promise<void>}
	 */
	initiateForQueueWorker(config: object): Promise<void>;

	/**
	 * There is certain cases where we need to boot the framework, but not run the web server
	 * Instead of calling prepare(), we can call this method
	 *
	 * @param {object} config
	 * @returns {Promise<void>}
	 */
	initiateWithoutServing(config: object): Promise<void>;

	/**
	 * Register core server extensions, envuso's hooks are basically wrappers around fastify hooks
	 *
	 * @param {Hook} hooks
	 */
	registerServerHooks(...hooks: (new () => HookContract)[]): void;

	/**
	 * Load a custom exception handler for handling errors from requests
	 * and returning a formatted response to your liking.
	 *
	 * @param handler
	 */
	addExceptionHandler(handler: ErrorHandlerFn): void;

	initialise(): Promise<void>;

	/**
	 * This will initialise all of the server
	 * Bind your custom exception handler and begin listening for connections.
	 */
	serve(): Promise<void>;

	unload(): Promise<void>;
}
