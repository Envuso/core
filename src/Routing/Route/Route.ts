import {FastifyReply, FastifyRequest, HTTPMethods} from "fastify";
import {RouteOptions} from "fastify/types/route";
import {ObjectId} from "mongodb";
import {match} from "path-to-regexp";
import qs from "querystring";
import {App, config} from "../../AppContainer";
import {Obj, Log, METADATA, StatusCodes} from "../../Common";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {MiddlewareContract} from "../../Contracts/Routing/Middleware/MiddlewareContract";
import {RouteContract, RouteMiddlewareHandlers} from "../../Contracts/Routing/Route/RouteContract";
import {Model} from "../../Database";
import {InvalidObjectIdUsed} from "../../Database/Exceptions/InvalidObjectIdUsed";
import {ModelNotFoundException} from "../../Database/Exceptions/ModelNotFoundException";
import {InertiaResponse} from "../../Packages/Inertia/InertiaResponse";
import {RequestContext} from "../Context/RequestContext";
import {RedirectResponse} from "../Context/Response/RedirectResponse";
import {Responsable} from "../Context/Response/Responsable";
import {Response} from "../Context/Response/Response";
import {Controller} from "../Controller/Controller";
import {AllControllerMeta, ControllerMetadata} from "../Controller/ControllerDecoratorBinding";
import {Middleware} from "../Middleware/Middleware";
import {MethodParameterDecorator} from "./RequestInjection";

export interface ControllerMethodParameterMetadata {
	name: string;
	type: any;
}

export interface ControllerMethodMetadata extends ControllerMetadata {
	method: HTTPMethods | HTTPMethods[];
	key: string;
	parameters: ControllerMethodParameterMetadata[];
}

export class Route implements RouteContract {

	/**
	 * When the route is initiated, we'll create the path
	 * from it's parts and ensure it's structured correctly
	 *
	 * Then we'll store it here.
	 *
	 * @type {string}
	 * @private
	 */
	private routePath: string = "";

	/**
	 * We parse any of the route path parameters, for example
	 * Imagine the path: /user/:username/view, this will
	 * give us an object of {username : ':username'}
	 *
	 * @type {{[p: string]: string}}
	 * @private
	 */
	private readonly routePathParameters: { [key: string]: string } = {};

	constructor(
		public controllerMeta: AllControllerMeta,
		public methodMeta: ControllerMethodMetadata
	) {
		this.storePreparedPath();

		this.routePathParameters = this.routePath.includes(':')
			? (<any>match(this.routePath)(this.routePath))?.params
			: {};
	}

	/**
	 * Get the HTTP verb used for this fastify route
	 */
	public getMethod(): HTTPMethods | HTTPMethods[] {
		return this.methodMeta.method;
	}

	/**
	 * Since {@see getMethod()} returns either a string or string[]
	 *
	 * We'll ensure this always outputs string[]
	 *
	 * @returns {HTTPMethods[]}
	 */
	public getMethods(): HTTPMethods[] {
		if (Array.isArray(this.methodMeta.method)) {
			return this.methodMeta.method;
		}

		return [this.methodMeta.method];
	}

	/**
	 * Return the controller path & method path so that it can be built up
	 */
	public pathParts() {
		return [
			this.controllerMeta.controller.path,
			this.methodMeta.path
		];
	}

	/**
	 * Get the structured path for this route
	 *
	 * @returns {string}
	 */
	public getPath(): string {
		return this.routePath;
	}

	/**
	 * Get the parameters for this route
	 * {@see routePathParameters} for information on this
	 *
	 * @returns {{[p: string]: string}}
	 */
	public getPathParameters(): { [key: string]: string } {
		return this.routePathParameters;
	}

	/**
	 * Parse the controller & method route, allows us to define routes without a leading /
	 */
	private storePreparedPath() {
		const pathParts = this.pathParts();

		if (!pathParts.length) {
			this.routePath = '/';
			return;
		}

		for (let path in pathParts) {
			pathParts[path] = pathParts[path].replace('/', '');
		}

		let path = pathParts.join('/');

		if (!path.startsWith('/')) {
			path = '/' + path;
		}

		if (path.endsWith('/')) {
			path = path.slice(0, -1);
		}

		if (path.trim() === '') {
			path = '/';
		}

		this.routePath = path;
	}

	/**
	 * Handle the request to the controller method
	 *
	 * @private
	 */
	public getHandlerFactory() {
		return async (request?: FastifyRequest, response?: FastifyReply) => {

			let httpContext: RequestContextContract | null = null;
			if (request)
				httpContext = Reflect.getMetadata(METADATA.HTTP_CONTEXT, request);

			const parameters = await this.parametersForRoute(request, response, httpContext);

			const controller = App.getInstance().resolve<Controller>(
				this.controllerMeta.controller.target
			);

			const routeMethod   = controller[this.methodMeta.key].bind(controller);
			const routeResponse = await routeMethod(...parameters);

			if (this.responseIsRedirect(response) && response?.sent) {
				return;
			}

			if (response?.sent) {
				console.warn('Response is already sent... something is offf.');
				return;
			}


			await Route.getResponseResult(routeResponse);
		};
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
	 * @param context
	 */
	public async parametersForRoute(request: FastifyRequest, response: FastifyReply, context: RequestContextContract) {

		//TODO: Double check we actually need this, pretty sure that
		//We figured out last night that, this was basically useless
		// const parameters = route.getMethodParameterTypes();
		//
		// if (!parameters.length) {
		// 	return [];
		// }

		const parameterArgs = [];

		for (let index in this.methodMeta.parameters) {
			const parameter = this.methodMeta.parameters[index];

			let boundParameter = false;

			for (let metadataKey of this.methodParamTypesForInjection()) {

				const methodMeta: MethodParameterDecorator = MethodParameterDecorator.getMethodMetadata(
					this.methodMeta.target[this.methodMeta.key],
					metadataKey
				);

				// @todo - here for @param... we can have multiple @param decorators
				// currently it only allows for one, they need to be an array

				if (!methodMeta) {
					continue;
				}

				if (Array.isArray(methodMeta)) {
					for (let methodMetaElement of methodMeta) {
						if (methodMetaElement.canBind(this.methodMeta.target[this.methodMeta.key], parameter.type, Number(index))) {
							const boundMetadata = await methodMetaElement.bind(request, response, context);
							parameterArgs.push(boundMetadata);
							boundParameter = true;
							break;
						}
					}

					if(boundParameter) {
						break;
					}
				} else {
					const canBind = methodMeta.canBind(this.methodMeta.target[this.methodMeta.key], parameter.type, Number(index));

					if (canBind) {
						const boundMetadata = await methodMeta.bind(request, response, context);
						parameterArgs.push(boundMetadata);

						boundParameter = true;
						break;
					}
				}


			}

			// Route model binding was conflicting with @user decorator... so
			// When we've handled a decorator for this parameter, we'll set bound
			// to true. This way, we can then fall-back to attempting route model binding.
			if (boundParameter) {
				continue;
			}

			if (parameter.type.prototype instanceof Model) {
				const modelInstance: typeof Model = parameter.type;

				const identifier = request.params[parameter.name];

				if (!ObjectId.isValid(identifier)) {
					throw new InvalidObjectIdUsed(modelInstance.name);
				}

				const model = await modelInstance.find(identifier) ?? null;

				if (model === null) {
					throw new ModelNotFoundException(modelInstance.name);
				}

				parameterArgs.push(model);
			}

		}

		return parameterArgs;
	}

	/**
	 * Get all parameter types for this method
	 *
	 * We can then begin to resolve all of the parameter data.
	 */
	public getMethodParameterTypes(): ControllerMethodParameterMetadata[] {
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
	 * Otherwise, we'll send the response of the {@see RequestContextContract}
	 *
	 * @param controllerResponse
	 * @private
	 */
	static async getResponseResult(controllerResponse: Response | RedirectResponse | any) {
		const context             = RequestContext.get();
		const {response, inertia} = context;

		if (controllerResponse === undefined || controllerResponse === null) {
			return response.setResponse(null, StatusCodes.NO_CONTENT).send();
		}

		/**
		 * Classes can implement Responsable interface, this will make it easier
		 * for us to follow this structure throughout the application.
		 *
		 * It's similar to the "toJSON()" method, but doesn't return a string.
		 */
		if ((<Responsable>controllerResponse).toResponse) {
			return response.setResponse(
				(<Responsable>controllerResponse).toResponse(),
				StatusCodes.ACCEPTED
			).send();
		}

		if (controllerResponse instanceof InertiaResponse) {
			return await controllerResponse.sendResponse();
		}

		const isResponseOrRedirect = (controllerResponse instanceof Response) || (controllerResponse instanceof RedirectResponse);

		if (!isResponseOrRedirect) {
			return response.setResponse(controllerResponse, StatusCodes.ACCEPTED).send();
		}

		if (controllerResponse instanceof RedirectResponse) {
			if (context.inertia.isInertiaRequest() && ['PUT', 'PATCH', 'DELETE'].includes(context.request.method())) {
				return response.fastifyReply.redirect(StatusCodes.SEE_OTHER, controllerResponse.getRedirectUrl());
			}
			return response.fastifyReply.redirect(controllerResponse.getRedirectUrl());
		}

		//		if (response.data === null || response.data === undefined) {
		//			response.data = {};
		//		}

		if (controllerResponse.data === null || controllerResponse.data === undefined) {
			controllerResponse.data = {};
		}

		controllerResponse.send();
	}

	/**
	 * Load the middleware for this route and return it as a fastify pre-handler
	 *
	 * @private
	 */
	public getMiddlewareHandlers(globalMiddleware: (new () => MiddlewareContract)[]): RouteMiddlewareHandlers {

		const controllerMiddlewareMeta = Middleware.getMetadata(
			this.controllerMeta.controller.target
		);

		const methodMiddlewareMeta = Middleware.getMetadata(
			this.methodMeta.target[this.methodMeta.key]
		);

		const middlewares: MiddlewareContract[] = [
			...(globalMiddleware.map(m => new m()) || []),
			...(controllerMiddlewareMeta?.middlewares || []),
			...(methodMiddlewareMeta?.middlewares || []),
		];

		if (config('app.logging.middleware', false)) {
			middlewares.forEach(mw => {
				Log.info(mw.constructor.name + ' was loaded for ' + this.getPath());
			});
		}

		return {
			before : async (context: RequestContextContract) => {
				for (const middleware of middlewares) {
					await middleware.handle(context);
				}
			},
			after  : async (context: RequestContextContract) => {
				for (const middleware of middlewares) {
					if (!middleware?.after) {
						continue;
					}
					await middleware.after(context);
				}
			}
		};

	}

	/**
	 * This is the object that will be passed to fastify to register our route
	 *
	 * @returns {RouteOptions}
	 */
	public getFastifyRouteBinding(globalMiddleware: (new () => MiddlewareContract)[]) {
		const {before, after} = this.getMiddlewareHandlers(globalMiddleware);

		const currentRoute = this;

		const binding: RouteOptions = {
			method     : this.getMethod(),
			handler    : this.getHandlerFactory(),
			url        : this.getPath(),
			preHandler : async function (req, res) {
				RequestContext.get().setCurrentRoute(currentRoute);

				if (before) {
					await before(RequestContext.get());
				}
			},
			onSend     : async function (req, res) {
				if (after) {
					await after(RequestContext.get());
				}
			}
		};

		return binding;
	}

	/**
	 * Check if the fastify reply is redirect response code...
	 * We have to do redirects a little weird at the moment
	 *
	 * @param {FastifyReply} response
	 * @return {boolean}
	 * @private
	 */
	private responseIsRedirect(response: FastifyReply) {
		if (response?.statusCode === undefined) {
			return false;
		}

		return [301, 302, 303, 307, 308].includes(response.statusCode);
	}

	/**
	 * Reflect Metadata keys that we'll use for method parameter handling. We
	 * basically iterate through these to see if they're applied to the method
	 * and if they are, it will return a {@see MethodParameterDecorator} instance
	 */
	public methodParamTypesForInjection(): Array<METADATA> {
		return [
			METADATA.REQUEST_METHOD_DTO,
			METADATA.REQUEST_METHOD_FASTIFY_REQUEST,
			METADATA.REQUEST_METHOD_ROUTE_PARAMETER,
			METADATA.REQUEST_METHOD_QUERY_PARAMETER,
			METADATA.REQUEST_METHOD_BODY,
			METADATA.REQUEST_METHOD_HEADERS,
			METADATA.REQUEST_AUTHENTICATED_USER,
		];
	}

	/**
	 * Get the name which will be used by the redirect route helper
	 *
	 * Returns a string like: "TestingController.testMethod"
	 *
	 * @returns {string}
	 */
	public getName(): string {
		return `${this.getControllerName()}.${this.getMethodName()}`;
	}

	/**
	 * Get the name of the controller this route is defined in
	 *
	 * @returns {string}
	 */
	public getControllerName(): string {
		return this.controllerMeta.controller.target.name;
	}

	/**
	 * Get the name of the method this route is registered on
	 *
	 * @returns {string}
	 */
	public getMethodName(): string {
		return this.methodMeta.key;
	}

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
	public constructUrl(attributes: any): string | null {
		const baseUrl = config('app.url');
		let routePath = this.getPath();

		// If we've passed in an attribute which is a route parameter
		// IE: /user/:username/view (:username being the "path parameter")
		// We want to put these values into the url
		if (!Obj.isEmpty(attributes)) {
			for (let pathParameterKey in this.getPathParameters()) {
				if (routePath.includes(`:${pathParameterKey}`) && attributes[pathParameterKey]) {
					routePath = routePath.replace(`:${pathParameterKey}`, attributes[pathParameterKey]);
					delete attributes[pathParameterKey];
				}
			}
		}

		let queryStringValues = {};
		if (!Obj.isEmpty(attributes)) {
			for (let attributeKey in attributes) {
				let attr = attributes[attributeKey];

				if (attr instanceof Model) {
					attr = attr.getModelId().toHexString();
				}

				queryStringValues[attributeKey] = attr;
			}
		}

		let finalUrl = routePath;
		if (!Obj.isEmpty(queryStringValues)) {
			finalUrl += '?';
			finalUrl += qs.stringify(queryStringValues);
		}

		return finalUrl;
	}
}
