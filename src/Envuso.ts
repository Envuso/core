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
	public async boot(config: object) {
		await this.initiateWithoutServing(config);
	}

	/**
	 * There is certain cases where we need to boot the framework, but not run the web server
	 * Instead of calling prepare(), we can call this method
	 *
	 * @param {object} config
	 * @returns {Promise<void>}
	 */
	public async initiateWithoutServing(config: object) {
		await App.bootInstance({config : config});

		await App.getInstance().loadServiceProviders();

		this._app = App.getInstance();

		this.registerServerHooks(
			BindRequestContextHook,
			InitiateRequestContextHook,
			ProcessUploadedFilesHook,
			SetResponseCookiesHook,
			SaveSessionHook,
			//HandleErrorHook
		);

		//		await FrameworkModuleMetaGenerator.generate();
		//		await RouteMetaGenerator.generate();

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
	 * This will initialise all of the server
	 * Bind your custom exception handler and begin listening for connections.
	 */
	public async serve() {
		this._server = resolve<Server>(Server);

		await this._server.initialise();

		this._server.registerHooks(this._serverHooks);

		await this._server.listen();
	}
}
