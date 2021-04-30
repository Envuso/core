"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Routing_1 = require("../Routing");
exports.default = {
    /**
     * Disable the websocket implementation
     */
    enabled: true,
    middleware: [
        Routing_1.JwtAuthenticationMiddleware
    ],
    /**
     * cors configuration for the socket server
     */
    cors: {
        enabled: true,
        //		options : {
        //			origin      : (origin: string, callback) => {
        //				callback(null, true);
        //			},
        //			credentials : true,
        //		}
    },
    options: {
        clientTracking: false
    }
};
//# sourceMappingURL=Websockets.js.map