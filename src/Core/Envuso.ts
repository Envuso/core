import {App, resolve} from "../AppContainer";
import {Log} from "../Common";
import {ErrorHandlerFn, Server} from "./Server/Server";

export class Envuso {

	private _app: App = null;

	private _server: Server = null;

	/**
	 * Boot the core App instance, bind any service
	 * providers to the container and such.
	 */
	async prepare(config: object) {
		await App.bootInstance({config:config});

		await App.getInstance().loadServiceProviders();

		this._app = App.getInstance();

		Log.success('Envuso is ready to go? PogU');

		this._server = resolve<Server>(Server);

		await this.serve();
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
		await this._server.initialise();

		await this._server.listen();
	}
}
