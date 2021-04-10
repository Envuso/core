/// <reference types="node" />
import { FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { AllControllerMeta, ControllerMetadata } from "../Controller/ControllerDecorators";
export interface ControllerMethodParameterMetadata {
    name: string;
    type: any;
}
export interface ControllerMethodMetadata extends ControllerMetadata {
    method: HTTPMethods | HTTPMethods[];
    key: string;
    parameters: ControllerMethodParameterMetadata[];
}
export declare class Route {
    controllerMeta: AllControllerMeta;
    methodMeta: ControllerMethodMetadata;
    constructor(controllerMeta: AllControllerMeta, methodMeta: ControllerMethodMetadata);
    /**
     * Returns all the fastify route arguments needed to
     * bind this route to the fastify instance
     */
    getFastifyOptions(): (string | {
        preHandler: (request: FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage>, response: FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown>) => Promise<void>;
    } | ((request?: FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage>, response?: FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown>) => Promise<never>))[];
    /**
     * Return the controller path & method path so that it can be built up
     */
    pathParts(): string[];
    /**
     * Parse the controller & method route, allows us to define routes without a leading /
     */
    getRoutePath(): string;
    /**
     * Handle the request to the controller method
     *
     * @private
     */
    getHandlerFactory(): (request?: FastifyRequest, response?: FastifyReply) => Promise<never>;
    /**
     * Get all parameter types for this method
     *
     * We can then begin to resolve all of the parameter data.
     */
    getMethodParameterTypes(): ControllerMethodParameterMetadata[];
    /**
     * Get the result of the response from the controller action.
     *
     * If the controller responded with undefined/null, we'll send a no content response
     * If there was an object returned directly from the controller, we'll create a new response and send it.
     *
     * Otherwise, we'll send the response of the {@see RequestContext}
     *
     * @param controllerResponse
     * @private
     */
    private getResponseResult;
    /**
     * Load the middleware for this route and return it as a fastify pre-handler
     *
     * @private
     */
    private getMiddlewareFactory;
}
