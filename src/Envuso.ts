import {App, resolve} from "./AppContainer";
import {Log} from "./Common";
import {BindRequestContextHook} from "./Server/InternalHooks/BindRequestContextHook";
import {HandleErrorHook} from "./Server/InternalHooks/HandleErrorHook";
import {InitiateRequestContextHook} from "./Server/InternalHooks/InitiateRequestContextHook";
import {ProcessUploadedFilesHook} from "./Server/InternalHooks/ProcessUploadedFilesHook";
import {SaveSessionHook} from "./Server/InternalHooks/SaveSessionHook";
import {SetResponseCookiesHook} from "./Server/InternalHooks/SetResponseCookiesHook";
import {ErrorHandlerFn, Server} from "./Server/Server";
import {Hook} from "./Server/ServerHooks";

export class Envuso {

	private _app: App = null;

	private _server: Server = null;

	private _serverHooks: (new () => Hook)[] = [];

	/**
	 * Boot the core App instance, bind any service
	 * providers to the container and such.
	 */
	async boot(config: object) {
		await this.initiateWithoutServing(config);
	}

	/**
	 * There is certain cases where we need to boot the framework, but not run the web server
	 * Instead of calling prepare(), we can call this method
	 *
	 * @param {object} config
	 * @returns {Promise<void>}
	 */
	async initiateWithoutServing(config: object) {
		await App.bootInstance({config : config});

		await App.getInstance().loadServiceProviders();

		this._app = App.getInstance();

		this.registerServerHooks(
			BindRequestContextHook,
			InitiateRequestContextHook,
			ProcessUploadedFilesHook,
			SetResponseCookiesHook,
			SaveSessionHook,
			HandleErrorHook
		)

		Log.success('Envuso is booted!');
	}

	/**
	 * Register core server extensions, envuso's hooks are basically wrappers around fastify hooks
	 *
	 * @param {Hook} hooks
	 */
	registerServerHooks(...hooks : (new () => Hook)[]) {
		for (let hook of hooks) {
			if(this._serverHooks.includes(hook)) {
				continue;
			}

			this._serverHooks.push(hook);
		}
	}

	/**
	 * Load a custom exception handler for handling errors from requests
	 * and returning a formatted response to your liking.
	 *
	 * @param handler
	 */
	addExceptionHandler(handler: ErrorHandlerFn) {
		this._server.setErrorHandling(handler);
	}

	/**
	 * This will initialise all of the server
	 * Bind your custom exception handler and begin listening for connections.
	 */
	async serve() {
		this._server = resolve<Server>(Server);

		await this._server.initialise();

		this._server.registerHooks(this._serverHooks);

		await this._server.listen();
	}
}
