/// <reference path="../../index.d.ts" />
/// <reference types="node" />
/// <reference types="node/http" />
import { FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { RequestContext } from "../Context/RequestContext";
import { Response } from "../Context/Response/Response";
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
     * Get the HTTP verb used for this fastify route
     */
    getMethod(): HTTPMethods | HTTPMethods[];
    /**
     * Return the controller path & method path so that it can be built up
     */
    pathParts(): string[];
    /**
     * Parse the controller & method route, allows us to define routes without a leading /
     */
    getPath(): string;
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
    static getResponseResult(controllerResponse: Response | any): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown>;
    /**
     * Load the middleware for this route and return it as a fastify pre-handler
     *
     * @private
     */
    getMiddlewareHandler(): (context: RequestContext) => Promise<void>;
}
