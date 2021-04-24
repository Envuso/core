import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {FastifyReply, FastifyRequest, HTTPMethods} from "fastify";
import {StatusCodes} from "http-status-codes";
import {App, ConfigRepository} from "../../AppContainer";
import {Log, METADATA} from "../../Common";
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
	method: HTTPMethods | HTTPMethods[];
	key: string;
	parameters: ControllerMethodParameterMetadata[];
}

export class Route {

	constructor(
		public controllerMeta: AllControllerMeta,
		public methodMeta: ControllerMethodMetadata
	) {}

	/**
	 * Get the HTTP verb used for this fastify route
	 */
	getMethod(): HTTPMethods | HTTPMethods[] {
		return this.methodMeta.method;
	}

	/**
	 * Return the controller path & method path so that it can be built up
	 */
	pathParts() {
		return [
			this.controllerMeta.controller.path,
			this.methodMeta.path
		];
	}

	/**
	 * Parse the controller & method route, allows us to define routes without a leading /
	 */
	getPath() {
		const pathParts = this.pathParts();

		for (let path in pathParts) {
			pathParts[path] = pathParts[path].replace('/', '');
		}

		let path = pathParts.join('/');

		if (!path.startsWith('/')) {
			path = '/' + path;
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

			const parameters = await RouteManager.parametersForRoute(
				request, response, this
			);

			let httpContext: RequestContext | null = null;
			if (request)
				httpContext = Reflect.getMetadata(METADATA.HTTP_CONTEXT, request);


			const controller = App.getInstance().resolve<Controller>(
				this.controllerMeta.controller.target
			);

			const routeMethod   = controller[this.methodMeta.key].bind(controller);
			const routeResponse = await routeMethod(...parameters);

			if (response?.sent) {
				console.warn('Response is already sent... something is offf.');
				return;
			}

			return Route.getResponseResult(routeResponse);
		};
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
		);

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
	static getResponseResult(controllerResponse: Response | any) {
		const response = RequestContext.response();

		if (controllerResponse === undefined || controllerResponse === null) {
			return response.setResponse(null, StatusCodes.NO_CONTENT).send();
		}

		const responseSerializationConfig = App.getInstance()
			.resolve(ConfigRepository)
			.get<ClassTransformOptions>(
				'server.responseSerialization', {
					enableCircularCheck : true,
					strategy            : 'exposeAll'
				} as ClassTransformOptions
			);

		if (!(controllerResponse instanceof Response)) {
			return response.setResponse(
				controllerResponse,
				//classToPlain(controllerResponse, responseSerializationConfig),
				StatusCodes.ACCEPTED
			).send();
		}



//		controllerResponse.data = serialize(
//			controllerResponse.data, responseSerializationConfig
//		);

		return controllerResponse.send();
	}

	/**
	 * Load the middleware for this route and return it as a fastify pre-handler
	 *
	 * @private
	 */
	getMiddlewareHandler() {

		const controllerMiddlewareMeta = Middleware.getMetadata(
			this.controllerMeta.controller.target
		);

		const methodMiddlewareMeta = Middleware.getMetadata(
			this.methodMeta.target[this.methodMeta.key]
		);

		const middlewares: Middleware[] = [
			...(controllerMiddlewareMeta?.middlewares || []),
			...(methodMiddlewareMeta?.middlewares || []),
		];

		middlewares.forEach(mw => {
			Log.info(mw.constructor.name + ' was loaded for ' + this.getPath());
		});

		return async (context: RequestContext) => {
			for (const middleware of middlewares) {
				await middleware.handler(context);
			}
		};

	}
}
