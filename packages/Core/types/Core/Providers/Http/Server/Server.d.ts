/// <reference types="node" />
import { FastifyInstance } from "fastify";
export declare class Server {
    /**
     * Our fastify instance for the server
     *
     * @private
     */
    private _app;
    /**
     * Injected controller service provider
     *
     * @private
     */
    private controllerProvider;
    /**
     * Initialise fastify, add all routes to the application and apply any middlewares
     */
    build(): Promise<FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>>;
    /**
     * Register all controller routes inside fastify
     *
     * @private
     */
    private registerControllers;
    cleanUpMetadata(): void;
    private registerPlugins;
    get app(): FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>;
}
