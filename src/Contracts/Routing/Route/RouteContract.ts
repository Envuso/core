import {FastifyReply, FastifyRequest, HTTPMethods} from "fastify";
import {RouteOptions} from "fastify/types/route";
import {AllControllerMeta} from "../../../Routing/Controller/ControllerDecoratorBinding";
import {ControllerMethodMetadata, ControllerMethodParameterMetadata} from "../../../Routing/Route/Route";
import {RequestContextContract} from "../Context/RequestContextContract";
import {MiddlewareContract} from "../Middleware/MiddlewareContract";

export type RouteMiddlewareHandlers = {
	before: (context: RequestContextContract) => Promise<void>;
	after: (context: RequestContextContract) => Promise<void>
}

export interface RouteContract {
	controllerMeta: AllControllerMeta;
	methodMeta: ControllerMethodMetadata;

	/**
	 * Get the HTTP verb used for this fastify route
	 */
	getMethod(): HTTPMethods | HTTPMethods[];

	getMethods(): HTTPMethods[];

	/**
	 * Return the controller path & method path so that it can be built up
	 */
	pathParts(): any[];

	/**
	 * Get the structured path for this route
	 *
	 * @returns {string}
	 */
	getPath(): string;

	/**
	 * Get the parameters for this route
	 * {@see routePathParameters} for information on this
	 *
	 * @returns {{[p: string]: string}}
	 */
	getPathParameters(): { [key: string]: string };

	/**
	 * Handle the request to the controller method
	 *
	 * @private
	 */
	getHandlerFactory(): (request?: FastifyRequest, response?: FastifyReply) => Promise<void>;

	/**
	 * Get all parameter types for this method
	 *
	 * We can then begin to resolve all of the parameter data.
	 */
	getMethodParameterTypes(): ControllerMethodParameterMetadata[];

	/**
	 * Load the middleware for this route and return it as a fastify pre-handler
	 *
	 * @private
	 */
	getMiddlewareHandlers(globalMiddleware: (new () => MiddlewareContract)[]): RouteMiddlewareHandlers;

	/**
	 * This is the object that will be passed to fastify to register our route
	 *
	 * @returns {RouteOptions}
	 */
	getFastifyRouteBinding(globalMiddleware: (new () => MiddlewareContract)[]): RouteOptions;

	/**
	 * Get the name which will be used by the redirect route helper
	 *
	 * Returns a string like: "TestingController.testMethod"
	 *
	 * @returns {string}
	 */
	getName(): string;

	/**
	 * Get the name of the controller this route is defined in
	 *
	 * @returns {string}
	 */
	getControllerName(): string;

	/**
	 * Get the name of the method this route is registered on
	 *
	 * @returns {string}
	 */
	getMethodName(): string;

	/**
	 * Attempt to construct a url to this route
	 *
	 * We can pass additional attributes, these will be set in
	 * the url, if they match a url path parameter
	 *
	 * Any additional attributes will be set as query string values
	 *
	 * @param attributes
	 * @returns {string | null}
	 */
	constructUrl(attributes: any): string | null;
}
