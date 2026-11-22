import type {WebSocketHandler} from "bun";
import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import Environment from "../AppContainer/Config/Environment";
import type {MiddlewareContract} from "../Contracts/Routing/Middleware/MiddlewareContract";

/**
 * Options passed straight to Bun.serve's websocket handler.
 * See https://bun.com/docs/api/websockets
 */
export type WebSocketServerOptions = Pick<WebSocketHandler<any>,
	'maxPayloadLength' | 'idleTimeout' | 'backpressureLimit' | 'closeOnBackpressureLimit' | 'perMessageDeflate' | 'sendPings' | 'publishToSelf'>;

export default class WebsocketsConfiguration extends ConfigurationCredentials {

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
