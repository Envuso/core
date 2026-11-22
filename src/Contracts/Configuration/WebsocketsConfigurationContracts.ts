import type {WebSocketHandler} from "bun";
import type {MiddlewareContract} from "../Routing/Middleware/MiddlewareContract";

/**
 * Options passed straight to Bun.serve's websocket handler.
 * See https://bun.com/docs/api/websockets
 */
export type WebSocketServerOptions = Pick<WebSocketHandler<any>,
	'maxPayloadLength' | 'idleTimeout' | 'backpressureLimit' | 'closeOnBackpressureLimit' | 'perMessageDeflate' | 'sendPings' | 'publishToSelf'>;

export interface WebsocketsConfiguration {
	/** The websocket server runs on its own port, next to the http server */
	port: number;
	hostname: string;
	/** Set to false to not start the websocket server */
	enabled: boolean;
	/** Run on every new connection, before it is marked ready */
	middleware: (new () => MiddlewareContract)[];
	server: WebSocketServerOptions;
}
