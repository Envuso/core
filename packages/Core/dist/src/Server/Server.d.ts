/// <reference types="node" />
import { Response } from "@envuso/routing";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare type ErrorHandlerFn = (exception: Error, request: FastifyRequest, reply: FastifyReply) => Promise<Response>;
export declare class Server {
    /**
     * Our fastify instance for the server
     *
     * @private
     */
    _server: FastifyInstance;
    /**
     * Allows the developer to implement their own error handling/formatting
     *
     * The framework package(that is cloned to create a new project) will implement
     * a base exception handler, by default the framework will use that class.
     * But... it can be over-ridden with a completely custom one.
     *
     * @private
     */
    private _customErrorHandler;
    /**
     * Initialise fastify, add all routes to the application and apply any middlewares
     */
    initialise(): Promise<FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>>;
    /**
     * Register all controller routes inside fastify
     *
     * @private
     */
    private registerControllers;
    /**
     * This will register app Fastify Plugins from Config/App.ts > fastifyPlugins
     *
     * @private
     */
    private registerPlugins;
    /**
     * Begin listening for connections
     */
    listen(): Promise<void>;
    setErrorHandling(handler: ErrorHandlerFn): void;
    private handleException;
}
