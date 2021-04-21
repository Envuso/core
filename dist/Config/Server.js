"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fastify_multipart_1 = tslib_1.__importDefault(require("fastify-multipart"));
exports.default = {
    /**
     * The port that fastify will listen on
     */
    port: 3000,
    /**
     * Server providers are Fastify Plugins that you register to the server when it's booted.
     */
    fastifyPlugins: [
        [
            fastify_multipart_1.default,
            {}
        ]
    ],
    /**
     * Any options to pass to fastify when it boots
     *
     */
    fastifyOptions: {}
};
//# sourceMappingURL=Server.js.map