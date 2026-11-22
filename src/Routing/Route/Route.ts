import type {FastifyReply, FastifyRequest, HTTPMethods} from "fastify";
import type {RouteOptions} from "fastify/types/route";
import {ObjectId} from "mongodb";
import {App} from "../../AppContainer/App";
import {config} from "../../AppContainer/helpers";
import {Obj} from "../../Common/Utility/Obj";
import {Log} from "../../Common/Logger/Log";
import {METADATA} from "../../Common/Decorators/RoutingMetaData";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";
import type {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import type {MiddlewareContract} from "../../Contracts/Routing/Middleware/MiddlewareContract";
import type {RouteContract, RouteMiddlewareHandlers} from "../../Contracts/Routing/Route/RouteContract";
import {Model} from "../../Database/Mongo/Model";
import {InvalidObjectIdUsed} from "../../Database/Exceptions/InvalidObjectIdUsed";
import {ModelNotFoundException} from "../../Database/Exceptions/ModelNotFoundException";
import {InertiaResponse} from "../../Packages/Inertia/InertiaResponse";
import {RequestContext} from "../Context/RequestContext";
import {RedirectResponse} from "../Context/Response/RedirectResponse";
import type {Responsable} from "../Context/Response/Responsable";
import {Response} from "../Context/Response/Response";
import {Controller} from "../Controller/Controller";
import type {AllControllerMeta, ControllerMetadata} from "../Controller/ControllerDecoratorBinding";
import {Middleware} from "../Middleware/Middleware";
import {MethodParameterDecorator} from "./RequestInjection/MethodParameterDecorator";
import {URL} from 'url';
import {isObjectId} from "../../Database/isObjectId";

type ParameterBinder = (request: FastifyRequest, response: FastifyReply, context: RequestContextContract) => any;

export interface ControllerMethodParameterMetadata {
	name: string;
	type: any;
}

export interface ControllerMethodMetadata extends ControllerMetadata {
	method: HTTPMethods | HTTPMethods[];
	key: string;
	parameters: ControllerMethodParameterMetadata[];
	fastifyRouteConfig: any,
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

		// "/user/:username/view" -> {username : ':username'}
		this.routePathParameters = Object.fromEntries(
			Array.from(this.routePath.matchAll(/:([A-Za-z_$][\w$]*)/g), ([param, name]) => [name, param])
		);
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

			// An async Fastify handler that sends the reply itself must return it; resolving with
			// undefined makes Fastify try to send again (ERR_HTTP_HEADERS_SENT)
			if (this.responseIsRedirect(response) && response?.sent) {
				return response;
			}

			if (response?.sent) {
				console.warn('Response is already sent... something is offf.');
				return response;
			}

			await Route.getResponseResult(routeResponse);

			return response;
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
		// Which decorator (or route model binding) fills each parameter only depends on the
		// method, so it's worked out on the first request instead of on every one
		const binders = this._parameterBinders ??= this.compileParameterBinders();

		// Arguments go at their parameter's position (an unbound parameter is undefined)
		const parameterArgs = new Array(binders.length).fill(undefined);

		for (let index = 0; index < binders.length; index++) {
			if (binders[index]) {
				parameterArgs[index] = await binders[index](request, response, context);
			}
		}

		return parameterArgs;
	}

	private _parameterBinders: (ParameterBinder | null)[] = null;

	/**
	 * One binder per method parameter: the first decorator that can bind it, else route
	 * model binding for a Model type, else nothing.
	 */
	private compileParameterBinders(): (ParameterBinder | null)[] {
		const method     = this.methodMeta.target[this.methodMeta.key];
		const parameters = Array.from(this.methodMeta.parameters ?? []) as any[];

		return parameters.map((parameter, index): ParameterBinder | null => {
			for (const metadataKey of this.methodParamTypesForInjection()) {
				const stored = MethodParameterDecorator.getMethodMetadata<MethodParameterDecorator | MethodParameterDecorator[]>(method, metadataKey);
				const list   = stored ? (Array.isArray(stored) ? stored : [stored]) : [];

				for (const decorator of list) {
					if (decorator.canBind(method, parameter.type, index)) {
						return (request, response, context) => decorator.bind(request, response, context);
					}
				}
			}

			if (parameter.type?.prototype instanceof Model) {
				const modelInstance: typeof Model = parameter.type;

				return async (request) => {
					const identifier = request.params[parameter.name];

					if (!isObjectId(identifier)) {
						throw new InvalidObjectIdUsed(modelInstance.name);
					}

					const model = await modelInstance.find(identifier) ?? null;

					if (model === null) {
						throw new ModelNotFoundException(modelInstance.name);
					}

					return model;
				};
			}

			return null;
		});
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
				return response.fastifyReply.redirect(controllerResponse.getRedirectUrl(), StatusCodes.SEE_OTHER);
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
			config     : {
				...(this.methodMeta.fastifyRouteConfig || {}),
				//rawBody: config<boolean>('server.rawBodyOnRequests', false)
			},
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
		const baseUrl = config<string>('app.url');
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

		const url = new URL(routePath, baseUrl);

		if (!Obj.isEmpty(attributes)) {
			for (let attributeKey in attributes) {
				let attr = attributes[attributeKey];

				if (attr instanceof Model) {
					attr = attr.getModelId().toHexString();
				}

				url.searchParams.set(attributeKey, attr);
			}
		}

		return url.toString();
	}
}
