import {FastifyReply, FastifyRequest, HTTPMethods} from "fastify";
import {App} from "../../AppContainer";
import {Log, METADATA, StatusCodes} from "../../Common";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {MiddlewareContract} from "../../Contracts/Routing/Middleware/MiddlewareContract";
import {RouteContract, RouteMiddlewareHandlers} from "../../Contracts/Routing/Route/RouteContract";
import {RequestContext} from "../Context/RequestContext";
import {RedirectResponse} from "../Context/Response/RedirectResponse";
import {Responsable} from "../Context/Response/Responsable";
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

export class Route implements RouteContract {

	constructor(
		public controllerMeta: AllControllerMeta,
		public methodMeta: ControllerMethodMetadata
	) {}

	/**
	 * Get the HTTP verb used for this fastify route
	 */
	public getMethod(): HTTPMethods | HTTPMethods[] {
		return this.methodMeta.method;
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
	 * Parse the controller & method route, allows us to define routes without a leading /
	 */
	public getPath() {
		const pathParts = this.pathParts();

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

		return path;
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

			const parameters = await RouteManager.parametersForRoute(
				request, response, this, httpContext
			);

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

			Route.getResponseResult(routeResponse);
		};
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
	static getResponseResult(controllerResponse: Response | RedirectResponse | any) {
		const response = RequestContext.response();

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

		const isResponseOrRedirect = (controllerResponse instanceof Response) || (controllerResponse instanceof RedirectResponse);

		if (!isResponseOrRedirect) {
			return response.setResponse(
				controllerResponse,
				StatusCodes.ACCEPTED
			).send();
		}

		if (controllerResponse instanceof RedirectResponse) {
			return response.fastifyReply.redirect(controllerResponse.getRedirectUrl());
		}


		if (response.data === null || response.data === undefined) {
			response.data = {};
		}

		if (controllerResponse.data === null || controllerResponse.data === undefined) {
			controllerResponse.data = {};
		}

		return controllerResponse.send();
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

		middlewares.forEach(mw => {
			Log.info(mw.constructor.name + ' was loaded for ' + this.getPath());
		});

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

	public getMethodName(): string {
		return this.methodMeta.key;
	}
}
