import {App, resolve} from "./AppContainer";
import {Log} from "./Common";
import {EnvusoContract} from "./Contracts/EnvusoContract";
import {ErrorHandlerFn} from "./Contracts/Server/ServerContract";
import {HookContract} from "./Contracts/Server/ServerHooks/HookContract";
import {BindRequestContextHook} from "./Server/InternalHooks/BindRequestContextHook";
import {InitiateRequestContextHook} from "./Server/InternalHooks/InitiateRequestContextHook";
import {ProcessUploadedFilesHook} from "./Server/InternalHooks/ProcessUploadedFilesHook";
import {SaveSessionHook} from "./Server/InternalHooks/SaveSessionHook";
import {SetResponseCookiesHook} from "./Server/InternalHooks/SetResponseCookiesHook";
import {Server} from "./Server/Server";
import {Hook} from "./Server/ServerHooks";

export class Envuso implements EnvusoContract {

	public _app: App = null;

	public _server: Server = null;

	public _serverHooks: (new () => HookContract)[] = [];

	/**
	 * Boot the core App instance, bind any service
	 * providers to the container and such.
	 */
	public async boot() {
		await this.initiateWithoutServing();
	}

	/**
	 * There is certain cases where we need to boot the framework, but not run the web server
	 * Instead of calling prepare(), we can call this method
	 *
	 * @returns {Promise<void>}
	 */
	public async initiateWithoutServing() {
		await App.bootInstance();

		await App.getInstance().loadServiceProviders();

		this._app = App.getInstance();

		this.registerServerHooks(
			BindRequestContextHook,
			InitiateRequestContextHook,
			ProcessUploadedFilesHook,
			SetResponseCookiesHook,
			SaveSessionHook,
			// HandleErrorHook
		);

		Log.success('Envuso is booted!');
	}

	/**
	 * Register core server extensions, envuso's hooks are basically wrappers around fastify hooks
	 *
	 * @param {Hook} hooks
	 */
	public registerServerHooks(...hooks: (new () => HookContract)[]) {
		for (let hook of hooks) {
			if (this._serverHooks.includes(hook)) {
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
	public addExceptionHandler(handler: ErrorHandlerFn) {
		this._server.setErrorHandling(handler);
	}

	/**
	 *
	 * @returns {Promise<void>}
	 */
	public async initialise() {
		this._server = resolve<Server>(Server);
		await this._server.initialise();
	}

	/**
	 * This will initialise all of the server
	 * Bind your custom exception handler and begin listening for connections.
	 */
	public async serve() {
		await this.initialise();

		this._server.registerHooks(this._serverHooks);

		await this._server.listen();
	}

	public async unload() {
		if (this._server)
			this._server.unload();

		await App.getInstance().unload();
		this._app    = null;
		this._server = null;
	}
}
