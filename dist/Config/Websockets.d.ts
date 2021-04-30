import { ServerOptions } from "ws";
import { JwtAuthenticationMiddleware } from "../Routing";
declare const _default: {
    /**
     * Disable the websocket implementation
     */
    enabled: boolean;
    middleware: (typeof JwtAuthenticationMiddleware)[];
    /**
     * cors configuration for the socket server
     */
    cors: {
        enabled: boolean;
    };
    options: ServerOptions;
};
export default _default;
