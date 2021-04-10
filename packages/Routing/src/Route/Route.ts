import {ConfigRepository} from "@envuso/app";
import {App} from "@envuso/app/dist/src";
import {METADATA} from "@envuso/common";
import {Log} from "@envuso/common/dist/src/Logger/Log";
import {classToPlain, serialize} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
import {StatusCodes} from "http-status-codes";
import {RequestContext} from "../Context/RequestContext";
import {Response} from "../Context/Response/Response";
import {Controller} from "../Controller/Controller";
import {AllControllerMeta, ControllerMetadata} from "../Controller/ControllerDecorators";
import {Middleware} from "../Middleware/Middleware";
import {RouteManager} from "./RouteManager";

export interface ControllerMethodParameterMetadata {
	name: string;
	type: any;
}

export interface ControllerMethodMetadata extends ControllerMetadata {
	method: string;
	key: string;
	parameters: ControllerMethodParameterMetadata[];
}

export class Route {

	constructor(
		public controllerMeta: AllControllerMeta,
		public methodMeta: ControllerMethodMetadata
	) {}

	/**
	 * Returns all the fastify route arguments needed to
	 * bind this route to the fastify instance
	 */
	getFastifyOptions() {
		return [
			this.getRoutePath(),
			this.getMiddlewareFactory(),
			this.getHandlerFactory(),
		]
	}

	/**
	 * Return the controller path & method path so that it can be built up
	 */
	pathParts() {
		return [
			this.controllerMeta.controller.path,
			this.methodMeta.path
		]
	}

	/**
	 * Parse the controller & method route, allows us to define routes without a leading /
	 */
	getRoutePath() {
		const pathParts = this.pathParts();

		for (let path in pathParts) {
			pathParts[path] = pathParts[path].replace('/', '');
		}

		let path = pathParts.join('/');

		if (!path.startsWith('/')) {
			path = '/' + path
		}

		return path;
	}

	/**
	 * Handle the request to the controller method
	 *
	 * @private
	 */
	getHandlerFactory() {
		return async (request?: FastifyRequest, response?: FastifyReply) => {

			try {

				const parameters = await RouteManager.parametersForRoute(
					request, response, this
				);

				const httpContext: RequestContext = Reflect.getMetadata(METADATA.HTTP_CONTEXT, request);

				const controller = App.getInstance().resolve<Controller>(
					this.controllerMeta.controller.target
				);

				const routeMethod   = controller[this.methodMeta.key];
				const routeResponse = await routeMethod(...parameters);

				if (response.sent) {
					console.warn('Response is already sent... something is offf.');
					return;
				}

				return this.getResponseResult(routeResponse);

			} catch (error) {
//				if (App.getInstance().container().isRegistered('ExceptionHandler')) {
//
//				}
				console.error(error);
			}
		}
	}

	/**
	 * Get all parameter types for this method
	 *
	 * We can then begin to resolve all of the parameter data.
	 */
	getMethodParameterTypes(): ControllerMethodParameterMetadata[] {
		const paramsTypes = Reflect.getMetadata(
			'design:paramtypes',
			this.methodMeta.target,
			this.methodMeta.key
		)

		if (!paramsTypes) {
			return [];
		}

		return paramsTypes;
	}


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
	private getResponseResult(controllerResponse: Response | any) {
		const response = RequestContext.response();

		if (controllerResponse === undefined || controllerResponse === null) {
			return response.setResponse(null, StatusCodes.NO_CONTENT).send();
		}

		const responseSerializationConfig = App.getInstance()
			.resolve(ConfigRepository)
			.get<ClassTransformOptions>(
				'http.responseSerialization', {
					enableCircularCheck : true,
					excludePrefixes     : ['_'],
					strategy            : 'exposeAll'
				} as ClassTransformOptions
			)

		if (!(controllerResponse instanceof Response)) {
			return response.setResponse(
				classToPlain(controllerResponse, responseSerializationConfig),
				StatusCodes.ACCEPTED
			).send();
		}

		controllerResponse.data = serialize(
			controllerResponse.data, responseSerializationConfig
		);

		return controllerResponse.send();
	}

	/**
	 * Load the middleware for this route and return it as a fastify pre-handler
	 *
	 * @private
	 */
	private getMiddlewareFactory() {

		const controllerMiddlewareMeta = Middleware.getMetadata(
			this.controllerMeta.controller.target.constructor
		);

		const methodMiddlewareMeta = Middleware.getMetadata(
			this.methodMeta.target[this.methodMeta.key]
		);

		const middlewares: Middleware[] = [
			...(controllerMiddlewareMeta?.middlewares || []),
			...(methodMiddlewareMeta?.middlewares || []),
		];

		middlewares.forEach(mw => {
			Log.info(mw.constructor.name + ' was loaded for ' + this.getRoutePath());
		})

		return {
			preHandler : async (request: FastifyRequest, response: FastifyReply) => {
				for (const middleware of middlewares) {
					try {
						await middleware.handler(request, response);
					} catch (exception) {
//						return ExceptionHandler.transform(exception, response);
						console.error(exception);
					}
				}
			}
		};
	}
}
