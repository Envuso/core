import {ServerOptions} from "ws";
import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {MiddlewareContract} from "../Contracts/Routing/Middleware/MiddlewareContract";
import {JwtAuthenticationMiddleware} from "../Routing/Middleware/Middlewares/JwtAuthenticationMiddleware";

export default class WebsocketsConfiguration extends ConfigurationCredentials {

	/**
	 * Disable the websocket implementation
	 */
	enabled: boolean = true;

	middleware: (new () => MiddlewareContract)[] = [
		// JwtAuthenticationMiddleware
	];

	/**
	 * cors configuration for the socket server
	 */
	cors = {
		enabled : true,
		// Not yet implemented... sorry
		//		options : {
		//			origin      : (origin: string, callback) => {
		//				callback(null, true);
		//			},
		//			credentials : true,
		//		}
	};

	options: ServerOptions = {
		clientTracking : false
	};

}
