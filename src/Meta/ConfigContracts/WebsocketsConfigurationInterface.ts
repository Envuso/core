import { ServerOptions } from "http";
import { MiddlewareContract } from "../../Contracts/Routing/Middleware/MiddlewareContract";

export interface WebsocketsConfigurationInterface {
    /**
     * Disable the websocket implementation
     */
    enabled: boolean;
    middleware: (new () => MiddlewareContract)[];
    /**
     * cors configuration for the socket server
     */
    cors: { enabled: boolean; };
    options: ServerOptions;
}
