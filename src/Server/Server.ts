import FastifyCors from "@fastify/cors";
import FastifyFormBody from "@fastify/formbody";
import fastify, {type FastifyError, type FastifyInstance, type FastifyReply, type FastifyRequest} from "fastify";
import FastifyRawBody from "fastify-raw-body";
import {ConfigRepository} from "../AppContainer/Config/ConfigRepository";
import {config, resolve} from "../AppContainer/helpers";
import {Exception} from "../Common/Exception/Exception";
import {Log} from "../Common/Logger/Log";
import {StatusCodes} from "../Common/Http/StatusCodes/StatusCodes";
import {getReasonPhrase} from "../Common/Http/StatusCodes/Mapper";
import type {ExceptionResponse} from "../Common/Exception/ExceptionHandler";
import type {ExceptionHandlerConstructorContract} from "../Contracts/Common/Exception/ExceptionHandlerContract";
import type {RequestContextContract} from "../Contracts/Routing/Context/RequestContextContract";
import type {ErrorHandlerFn, ServerConfiguration, ServerContract} from "../Contracts/Server/ServerContract";
import type {HookContract} from "../Contracts/Server/ServerHooks/HookContract";
import {RequestContext} from "../Routing/Context/RequestContext";
import {RedirectResponse} from "../Routing/Context/Response/RedirectResponse";
import {Routing} from "../Routing/Route/Routing";
import {AssetManager} from "../Routing/StaticAssets/AssetManager";

export class Server implements ServerContract {

	/**
	 * Our fastify instance for the server
	 *
	 * @private
	 */
	public _server: FastifyInstance;

	/**
	 * Allows the developer to implement their own error handling/formatting
	 *
	 * The framework package(that is cloned to create a new project) will implement
	 * a base exception handler, by default the framework will use that class.
	 * But... it can be over-ridden with a completely custom one.
	 *
	 * @private
	 */
	public _customErrorHandler: ErrorHandlerFn | null = null;

	/**
	 * Configuration from the Server.ts config file
	 *
	 * @type {ServerConfiguration}
	 * @private
	 */
	public _config: ServerConfiguration;

	private _exceptionHandler: ExceptionHandlerConstructorContract = null;

	private _registeredServerHooks: (new () => HookContract)[] = [];

	/**
	 * Initialise fastify, add all routes to the application and apply any middlewares
	 */
	public async initialise() {
		if (this._server)
			throw new Error('Server has already been built');

		const config = resolve(ConfigRepository);

		this._config    = config.get<string, any>('Server');
		const appConfig = config.get<string, any>('App');

		this._exceptionHandler = appConfig.exceptionHandler;

		this._server = fastify(this._config.fastifyOptions);

		this.registerPlugins();

		this._server.setNotFoundHandler((request: FastifyRequest, response: FastifyReply) => {
			response.code(404).send({message : "Not found"});
		});

		this.registerRoutes();

		resolve(AssetManager).registerAssetPaths(this._server);

		return this._server;
	}

	/**
	 * Register all controller routes inside fastify
	 *
	 * @private
	 */
	public registerRoutes() {
		// Every boot (including App.reboot()) loads the current controllers
		Routing.get().loadControllers();

		const controllers = Routing.get().getControllers();

		for (let controller of controllers) {
			const routes = controller.routes;

			for (let route of routes) {

				this._server.route({
					...route.getFastifyRouteBinding(this._config.middleware || []),

					errorHandler : async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
						return await this.handleException(RequestContext.get(), error, request, reply);
					}
				});

				if (config('app.logging.routes', false)) {
					const controllerName = ((controller?.controller as any)?.name ?? controller.controller.constructor.name);

					Log.info(`Route Loaded: ${controllerName}(${route.getMethod()} ${route.getPath()})`);
				}

			}
		}
	}

	public registerHooks(hooks: { new(): HookContract }[]) {
		for (let hook of hooks) {
			new hook().register(this._server);

			this._registeredServerHooks.push(hook);
		}
	}

	/**
	 * Check if we've registered a specific server hook
	 *
	 * @param {{new(): HookContract}} hook
	 * @returns {boolean}
	 */
	public hasRegisteredServerHook(hook: (new () => HookContract)): boolean {
		return this._registeredServerHooks.includes(hook);
	}

	/**
	 * This will register app Fastify Plugins from Config/App.ts > fastifyPlugins
	 *
	 * @private
	 */
	public registerPlugins() {

		// We have to make sure the cors configuration aligns with the framework configuration.
		if (this._config.cors.enabled) {
			this._config.fastifyPlugins.push([
				FastifyCors,
				{
					...this._config.cors.options,
					...{
						optionsSuccessStatus : 202,
						preflightContinue    : true
					}
				}
			]);
		}

		this._config.fastifyPlugins.push([
			FastifyRawBody,
			{field : 'rawBody', runFirst : true, global : false}
		]);

		this._config.fastifyPlugins.push([
			FastifyFormBody,
			{}
		]);

		this._config.fastifyPlugins.forEach(plugin => {
			this._server.register(plugin[0], plugin[1]);
		});
	}

	/**
	 * Begin listening for connections
	 */
	public async listen() {
		const listenStr = await this._server.listen({port : this._config.port, host : this._config.address});

		Log.success('Server is running at ' + listenStr);
	}

	public setErrorHandling(handler: ErrorHandlerFn) {
		this._customErrorHandler = handler;
	}

	public async handleException(context: RequestContextContract, error: Error | Exception, request: FastifyRequest, reply: FastifyReply) {
		// addExceptionHandler(): used to be stored and never called.
		// Runs first: it only needs the error, request and reply
		if (this._customErrorHandler) {
			// Return a Response, or the reply after sending it yourself; return nothing to
			// fall back to the ExceptionHandler. (reply.sent isn't set until the async onSend
			// hooks finish, so it can't tell us the handler already answered.)
			const custom: any = await this._customErrorHandler(error, request, reply);

			if (custom === reply || reply.sent) {
				return reply;
			}
			if (custom) {
				return custom.send();
			}
		}

		// Errors before the request context is bound (e.g. Fastify failing to parse the body)
		// can't go through the handler, which needs the request; answer them directly
		if (!context?.request) {
			const statusCode = (error as any)?.statusCode ?? (error as any)?.code;
			const code       = Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 600
				? statusCode
				: StatusCodes.INTERNAL_SERVER_ERROR;

			if (code >= 500) {
				Log.exception('Unhandled error before the request context was bound:', error);
			}

			return reply.status(code).send({
				code,
				message : code < 500 ? error.message : getReasonPhrase(code),
				data    : {},
			});
		}

		const result = this._exceptionHandler.handle(context.request, error);

		if (result instanceof RedirectResponse) {
			if (context.inertia.isInertiaRequest() && ['PUT', 'PATCH', 'DELETE'].includes(context.request.method())) {
				return reply.redirect(result.getRedirectUrl(), StatusCodes.SEE_OTHER);
			}
			return reply.redirect(result.getRedirectUrl());
		}

		return reply.status((result as ExceptionResponse).code).send((result as ExceptionResponse));

	}

	public async unload() {
		if (this._server) {
			await this._server.close();
		}
		this._server             = null;
		this._config             = null;
		this._exceptionHandler   = null;
		this._customErrorHandler = null;
	}
}
