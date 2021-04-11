/// <reference types="node" />
import { FastifyPlugin, FastifyPluginOptions, FastifyServerOptions } from "fastify";
declare const _default: {
    /**
     * The port that fastify will listen on
     */
    port: number;
    /**
     * Server providers are Fastify Plugins that you register to the server when it's booted.
     */
    fastifyPlugins: [FastifyPlugin<Record<never, never>>, FastifyPluginOptions][];
    /**
     * Any options to pass to fastify when it boots
     *
     */
    fastifyOptions: FastifyServerOptions<import("http").Server, import("fastify").FastifyLoggerInstance>;
};
export default _default;
