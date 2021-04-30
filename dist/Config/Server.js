"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_multipart_1 = __importDefault(require("fastify-multipart"));
exports.default = {
    /**
     * The port that fastify will listen on
     */
    port: 3000,
    middleware: [],
    /**
     * Cors is automatically configured internally due to some framework
     * configuration that needs to align. But you can also adjust the
     * configuration you wish to use here.
     */
    cors: {
        enabled: true,
        options: {
            origin: (origin, callback) => {
                callback(null, true);
            },
            credentials: true,
        }
    },
    /**
     * Server providers are Fastify Plugins that you register to the server when it's booted.
     */
    fastifyPlugins: [
        [
            fastify_multipart_1.default,
            {}
        ],
        [require('fastify-helmet'), { contentSecurityPolicy: false }]
    ],
    /**
     * Any options to pass to fastify when it boots
     *
     */
    fastifyOptions: {},
    /**
     * Before we return a response we serialize the result, mainly
     * so that class transformer can do it's work, but also to help
     * with random errors that occur from circular references.
     *
     * excludeExtraneousValues can induce results that you might not
     * expect but helps prevent internal references used in your code
     * and the framework from being returned in a response.
     */
    responseSerialization: {
        enableCircularCheck: true,
        strategy: "exposeAll",
        //		excludeExtraneousValues : true,
    }
};
//# sourceMappingURL=Server.js.map