/// <reference types="node" />
import { FastifyReply, FastifyRequest } from "fastify";
import { RouteHandlerMethod } from "fastify/types/route";
import { ControllerMetadata, ControllerMethodMetadata } from "@Core";
export declare class Route {
    private controllerConstructor;
    private controllerMetadata;
    private controllerMethodMetadata;
    private metadata;
    constructor(controllerConstructor: Function, controllerMetadata: ControllerMetadata, controllerMethodMetadata: ControllerMethodMetadata[], metadata: ControllerMethodMetadata);
    /**
     * Returns all the fastify route arguments needed to
     * bind this route to the fastify instance
     */
    getFastifyRouteOptions(): (string | RouteHandlerMethod<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown> | {
        preHandler: (request: FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage>, response: FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown>) => Promise<never>;
    })[];
    /**
     * Load the middleware for this route and return it as a fastify pre-handler
     *
     * @param routePath
     * @private
     */
    private getMiddlewareAdapter;
    /**
     * Parse the controller & method route, allows us to define routes without a leading /
     */
    getRoutePath(): string;
    /**
     * Handle the request to the controller method
     *
     * @private
     */
    private resolveHandlerFactory;
    /**
     * Handle any controller method parameter injection
     * Route model binding, data transfer objects, request, response etc...
     *
     * @param request
     * @param response
     * @private
     */
    private injectRouteDecorators;
    /**
     * Get the result of the response from the controller action.
     *
     * If the controller responded with undefined/null, we'll send a no content response
     * If there was an object returned directly from the controller, we'll create a new response and send it.
     *
     * Otherwise, we'll send the response of the {@see HttpContext}
     *
     * @param controllerResponse
     * @private
     */
    private getResponseResult;
    private replaceCircularReferenceInResponse;
}
