import { FastifyReply, FastifyRequest } from "fastify";
import { METADATA } from "../../Common";
import { Route } from "./Route";
export declare class RouteManager {
    /**
     * Reflect Metadata keys that we'll use for method parameter handling. We
     * basically iterate through these to see if they're applied to the method
     * and if they are, it will return a {@see MethodParameterDecorator} instance
     */
    static methodParamTypesForInjection(): Array<METADATA>;
    /**
     * Parse all of the types for the requested controller method.
     * We'll then see if we can apply any decorator/DI to these parameters.
     *
     * Handles things like Route model binding, dto resolving & validating,
     * injecting request, response etc.
     *
     * @param request
     * @param response
     * @param route
     */
    static parametersForRoute(request: FastifyRequest, response: FastifyReply, route: Route): Promise<any[]>;
}
