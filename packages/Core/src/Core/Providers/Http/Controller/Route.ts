import {Config} from "@Config";
import {Log} from "@Providers/Log/Log";
import console from 'chalk-console';
import {classToPlain, serialize} from "class-transformer";
import {FastifyReply, FastifyRequest} from "fastify";
import {RouteHandlerMethod} from "fastify/types/route";
import StatusCodes from "http-status-codes";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {ExceptionHandler} from "@App/Exceptions/ExceptionHandler";
import {CONTROLLER_METHOD_PARAMS, METADATA} from "@Core/DecoratorData";
import {ControllerMetadata} from "@Decorators";
import {DecoratorHelpers} from "@Core/Decorators/DecoratorHelpers";
import {ControllerMethodMetadata, ControllerMethodParameterMetadata} from "@Decorators";
import {ModelEntity} from "@Core/Providers/Model";
import {HttpResponse, HttpContext, ControllerRequestParamDecorator} from "@Core/Providers/Http";
import {Controller} from "./Controller";
import {Middleware} from "./Middleware";

@injectable()
export class Route {

	constructor(
		private controllerConstructor: Function,
		private controllerMetadata: ControllerMetadata,
		private controllerMethodMetadata: ControllerMethodMetadata[],
		private metadata: ControllerMethodMetadata
	) {}

	/**
	 * Returns all the fastify route arguments needed to
	 * bind this route to the fastify instance
	 */
	getFastifyRouteOptions() {
		const handler           = this.resolveHandlerFactory();
		const routePath: string = this.getRoutePath();
		const middlewareAdapter = this.getMiddlewareAdapter(routePath);

		return [routePath, middlewareAdapter, handler];
	}

	/**
	 * Load the middleware for this route and return it as a fastify pre-handler
	 *
	 * @param routePath
	 * @private
	 */
	private getMiddlewareAdapter(routePath: string) {
		const controllerMiddlewareMeta  = Middleware.getMetadata(this.controllerConstructor);
		const methodMiddlewareMeta      = Middleware.getMetadata(this.metadata.target[this.metadata.key]);
		const middlewares: Middleware[] = [
			...(controllerMiddlewareMeta?.middlewares || []),
			...(methodMiddlewareMeta?.middlewares || []),
		];

		middlewares.forEach(mw => {
			Log.info(mw.constructor.name + ' was loaded for ' + routePath);
		})

		return {
			preHandler : async (request: FastifyRequest, response: FastifyReply) => {
				for (const middleware of middlewares) {
					try {
						await middleware.handler(request, response);
					} catch (exception) {
						return ExceptionHandler.transform(exception, response);
					}
				}
			}
		};
	}

	/**
	 * Parse the controller & method route, allows us to define routes without a leading /
	 */
	getRoutePath() {

		const routes = [
			this.controllerMetadata.path,
			this.metadata.path
		];

		for (let route in routes) {
			routes[route] = routes[route].replace('/', '');
		}

		let route = routes.join('/');


		if (!route.startsWith('/')) {
			route = '/' + route
		}

		return route;


//		if (!this.controllerMetadata.path.startsWith('/')) {
//			this.controllerMetadata.path = '/' + this.controllerMetadata.path;
//		}
//
//		if (!this.metadata.path.startsWith('/')) {
//			this.metadata.path = '/' + this.metadata.path;
//		}
//
//		if (this.controllerMethodMetadata.length === 1 && this.controllerMetadata.path === '/') {
//			this.metadata.path = '';
//		}
//
//		let path = `${this.controllerMetadata.path}${this.metadata.path}`;
//
//		if (path.endsWith('/')) {
//			path = path.substring(0, path.length - 1);
//		}
//
//		return path;
	}

	/**
	 * Handle the request to the controller method
	 *
	 * @private
	 */
	private resolveHandlerFactory(): RouteHandlerMethod {
		return async (request: FastifyRequest, response: FastifyReply) => {
			try {
				const routeParameters          = await this.injectRouteDecorators(request, response);
				const httpContext: HttpContext = Reflect.getMetadata(METADATA.HTTP_CONTEXT, request);

				const value = await httpContext.container.getNamed<any>(
					Controller, this.controllerMetadata.target.name
				)[this.metadata.key](...routeParameters);

				if (response.sent) {
					console.warn('Res was already sent');
					return;
				}

				return this.getResponseResult(value);
			} catch (error) {
				return ExceptionHandler.transform(error, response);
			}
		};
	}

	/**
	 * Handle any controller method parameter injection
	 * Route model binding, data transfer objects, request, response etc...
	 *
	 * @param request
	 * @param response
	 * @private
	 */
	private async injectRouteDecorators(request: FastifyRequest, response: FastifyReply) {
		const paramArgs: any[] = [];

		const params = DecoratorHelpers.paramTypes(this.metadata.target, this.metadata.key)

		if (!params) {
			return [request, response];
		}

		for (let index in this.metadata.parameters) {
			const parameter: ControllerMethodParameterMetadata = this.metadata.parameters[index];

			if (parameter.type.prototype instanceof ModelEntity) {
				const identifier = request.params[parameter.name];
				const model      = await parameter.type.query().findById(new ObjectId(identifier)) ?? null;

				paramArgs.push(model);

				continue;
			}

			for (const metadataKey of CONTROLLER_METHOD_PARAMS) {
				const methodMeta: ControllerRequestParamDecorator = ControllerRequestParamDecorator.getMethodMetadata(
					this.metadata.target[this.metadata.key],
					metadataKey
				);

				if (!methodMeta) {
					continue;
				}

				if (methodMeta.canBind(this.metadata.target[this.metadata.key], parameter.type, Number(index))) {
					paramArgs.push(await methodMeta.bind(request, response));
					break;
				}
			}

		}

		//		for (let paramIndex in params) {
		//			const param = params[paramIndex];
		//
		//			for (const metadataKey of CONTROLLER_METHOD_PARAMS) {
		//
		//				const methodMeta: ControllerRequestParamDecorator = ControllerRequestParamDecorator.getMethodMetadata(
		//					this.metadata.target[this.metadata.key],
		//					metadataKey
		//				);
		//
		//				if (!methodMeta) {
		//					continue;
		//				}
		//
		//				if (methodMeta.canBind(this.metadata.target[this.metadata.key], param, Number(paramIndex))) {
		//					paramArgs.push(await methodMeta.bind(request, response));
		//					break;
		//				}
		//
		//			}
		//		}

		//paramArgs.push(request, response);

		return paramArgs;


//		const routeArguments: any[] = [];
//
//		if (!parameterMetadata || !parameterMetadata.length) {
//			return [request, response];
//		}
//
//		for (const param of parameterMetadata) {
//			const {type, index, parameterName, injectRoot, cast, validateOnRequest} = param;
//
//			switch (type) {
//				case PARAMETER_TYPE.REQUEST:
//					routeArguments[index] = request;
//					break;
//				case PARAMETER_TYPE.PARAMS:
//					routeArguments[index] = this.getParam(request, "params", injectRoot, parameterName);
//					break;
//				case PARAMETER_TYPE.QUERY:
//					routeArguments[index] = this.getParam(request, "query", injectRoot, parameterName);
//					break;
//				case PARAMETER_TYPE.BODY:
//					routeArguments[index] = request.body;
//					break;
//				case PARAMETER_TYPE.DTO:
//					if (this.shouldBindDto(cast)) {
//						routeArguments[index] = await this.bindDto(cast, request.body, validateOnRequest);
//					}
//					break;
//				case PARAMETER_TYPE.HEADERS:
//					routeArguments[index] = this.getParam(request, "headers", injectRoot, parameterName);
//					break;
//				case PARAMETER_TYPE.COOKIES:
//					routeArguments[index] = this.getParam(request, "cookies", injectRoot, parameterName);
//					break;
//				default:
//					routeArguments[index] = response;
//					break; // response
//			}
//		}
//
//		routeArguments.push(request, response);

//		return routeArguments;
	}

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
	private getResponseResult(controllerResponse: HttpResponse | any) {
		const response = HttpContext.response();

		if (controllerResponse === undefined || controllerResponse === null) {
			return response.setResponse(null, StatusCodes.NO_CONTENT).send();
		}


		if (!(controllerResponse instanceof HttpResponse)) {
			return response.setResponse(
				classToPlain(controllerResponse, Config.http.responseSerialization),
				StatusCodes.ACCEPTED
			).send();
		}

		const conf              = Config.http.responseSerialization;
		controllerResponse.data = serialize(controllerResponse.data, conf);

		return controllerResponse.send();
	}

	private replaceCircularReferenceInResponse(val, cache = null) {
		cache = cache || new WeakSet();

		if (val && typeof (val) === 'object') {
			if (cache.has(val)) return '[Circular]';

			cache.add(val);

			const obj = (Array.isArray(val) ? [] : {});
			for (const idx in val) {
				obj[idx] = this.replaceCircularReferenceInResponse(val[idx], cache);
			}

			cache.delete(val);
			return obj;
		}

		return val;
	};


}
