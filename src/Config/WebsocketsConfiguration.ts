import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import Environment from "../AppContainer/Config/Environment";
import type {WebsocketsConfiguration as WebsocketsConfig, WebSocketServerOptions} from "../Contracts/Configuration/WebsocketsConfigurationContracts";
import type {MiddlewareContract} from "../Contracts/Routing/Middleware/MiddlewareContract";

export default class WebsocketsConfiguration extends ConfigurationCredentials implements WebsocketsConfig {

	/**
	 * The websocket server runs on its own port, next to the http server
	 */
	port: number = Number(Environment.get('WEBSOCKET_PORT', 3335));

	hostname: string = Environment.get('WEBSOCKET_HOST', '0.0.0.0');

	/**
	 * Disable the websocket implementation
	 */
	enabled: boolean = true;

	middleware: (new () => MiddlewareContract)[] = [
		// JwtAuthenticationMiddleware
		// AuthenticatedMiddleware,
	];

	server: WebSocketServerOptions = {
		/** Maximum length of a received message; larger messages close the connection. */
		maxPayloadLength  : 16 * 1024 * 1024,
		/** Seconds without a message before the connection is closed. 0 disables it. */
		idleTimeout       : 32,
		/** permessage-deflate compression */
		perMessageDeflate : true,
	};

}
