import {METADATA} from "@envuso/common";
import {Log} from "@envuso/common/dist/src/Logger/Log";
import {FastifyReply, FastifyRequest} from "fastify";
import {MethodParameterDecorator} from "./RequestInjection/MethodParameterDecorator";
import {Route} from "./Route";

export class RouteManager {

	/**
	 * Reflect Metadata keys that we'll use for method parameter handling. We
	 * basically iterate through these to see if they're applied to the method
	 * and if they are, it will return a {@see MethodParameterDecorator} instance
	 */
	public static methodParamTypesForInjection(): Array<METADATA> {
		return [
			METADATA.REQUEST_METHOD_DTO,
			METADATA.REQUEST_METHOD_FASTIFY_REQUEST,
			METADATA.REQUEST_METHOD_ROUTE_PARAMETER,
			METADATA.REQUEST_METHOD_QUERY_PARAMETER,
			METADATA.REQUEST_METHOD_BODY,
			METADATA.REQUEST_METHOD_HEADERS
		];
	}

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
	public static async parametersForRoute(request: FastifyRequest, response: FastifyReply, route: Route) {
		const parameters = route.getMethodParameterTypes();

		if (!parameters.length) {
			return [];
		}

		const parameterArgs = [];

		for (let index in route.methodMeta.parameters) {
			const parameter = route.methodMeta.parameters[index];

			//@TODO: Add route model binding back here...
			/*if (parameter.type.prototype instanceof ModelEntity) {
			 const identifier = request.params[parameter.name];
			 const model      = await parameter.type.query().findById(new ObjectId(identifier)) ?? null;

			 paramArgs.push(model);

			 continue;
			 }*/

			for (let metadataKey of this.methodParamTypesForInjection()) {

				const methodMeta: MethodParameterDecorator = MethodParameterDecorator.getMethodMetadata(
					route.methodMeta.target[route.methodMeta.key],
					metadataKey
				);

				if (!methodMeta) {
					Log.info('Param '+route.methodMeta.key+' doesnt have meta for injector: '+metadataKey);

					continue;
				}

				const canBind = methodMeta.canBind(
					route.methodMeta.target[route.methodMeta.key],
					parameter.type,
					Number(index)
				);

				if (canBind) {
					parameterArgs.push(await methodMeta.bind(request, response));
					break;
				}
			}

		}

		return parameterArgs;
	}


}
