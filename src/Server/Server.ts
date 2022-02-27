import fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {FastifyError} from "fastify-error";
import middie from "middie";
import {config, ConfigRepository, resolve} from "../AppContainer";
import {Exception, Log, StatusCodes} from "../Common";
import {ExceptionResponse} from "../Common/Exception/ExceptionHandler";
import {ExceptionHandlerConstructorContract} from "../Contracts/Common/Exception/ExceptionHandlerContract";
import {RequestContextContract} from "../Contracts/Routing/Context/RequestContextContract";
import {ErrorHandlerFn, ServerConfiguration, ServerContract} from "../Contracts/Server/ServerContract";
import {HookContract} from "../Contracts/Server/ServerHooks/HookContract";
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

		await this._server.register(middie);

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
		Routing.initiate();

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
				require('fastify-cors'),
				{
					...this._config.cors.options,
					...{
						optionsSuccessStatus : 202,
						preflightContinue    : true
					}
				}
			]);
		}


		if (this._config.rawBodyOnRequests) {
			this._config.fastifyPlugins.push([
				require('fastify-raw-body'),
				{field : 'rawBody', runFirst : true}
			]);
		}

		this._config.fastifyPlugins.push([
			require('fastify-formbody'),
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
		const listenStr = await this._server.listen(this._config.port, this._config.address);

		Log.success('Server is running at ' + listenStr);
	}

	public setErrorHandling(handler: ErrorHandlerFn) {
		this._customErrorHandler = handler;
	}

	public async handleException(context: RequestContextContract, error: Error | Exception, request: FastifyRequest, reply: FastifyReply) {
		const result = this._exceptionHandler.handle(context.request, error);

		if (result instanceof RedirectResponse) {
			if (context.inertia.isInertiaRequest() && ['PUT', 'PATCH', 'DELETE'].includes(context.request.method())) {
				return reply.redirect(StatusCodes.SEE_OTHER, result.getRedirectUrl());
			}
			return reply.redirect(result.getRedirectUrl());
		}

		return reply.status((result as ExceptionResponse).code).send((result as ExceptionResponse));

		/*if (!this._customErrorHandler) {
		 const response = (error instanceof Exception) ? error.response : {
		 message : error.message,
		 code    : 500,
		 };
		 const code     = (error instanceof Exception) ? error.code : 500;

		 return reply.status(code).send(response);
		 }

		 const response: ResponseContract = await this._customErrorHandler(error, request, reply);

		 response.send();*/
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
