import {FastifyReply, FastifyRequest, HTTPMethods} from "fastify";
import {AllControllerMeta} from "../../../Routing/Controller/ControllerDecorators";
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

	/**
	 * Return the controller path & method path so that it can be built up
	 */
	pathParts(): any[];

	/**
	 * Parse the controller & method route, allows us to define routes without a leading /
	 */
	getPath(): any;

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

	getMethodName(): string;
}
