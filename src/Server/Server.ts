import fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {FastifyError} from "fastify-error";
import middie from "middie";
import {config, ConfigRepository, resolve} from "../AppContainer";
import {Exception, Log} from "../Common";
import {ExceptionHandlerConstructorContract, ExceptionHandlerContract} from "../Contracts/Common/Exception/ExceptionHandlerContract";
import {RequestContextContract} from "../Contracts/Routing/Context/RequestContextContract";
import {ResponseContract} from "../Contracts/Routing/Context/Response/ResponseContract";
import {ErrorHandlerFn, ServerConfiguration, ServerContract} from "../Contracts/Server/ServerContract";
import {HookContract} from "../Contracts/Server/ServerHooks/HookContract";
import {RequestContext} from "../Routing/Context/RequestContext";
import {ControllerManager} from "../Routing/Controller/ControllerManager";
import {AssetManager} from "../Routing/StaticAssets/AssetManager";
import {SocketServer} from "../Sockets/SocketServer";


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

		this.registerControllers();

		resolve(AssetManager).registerAssetPaths(this._server);

		return this._server;
	}

	/**
	 * Register all controller routes inside fastify
	 *
	 * @private
	 */
	public registerControllers() {

		const controllers = ControllerManager.initiateControllers();

		for (let controller of controllers) {
			const routes = controller.routes;

			for (let route of routes) {

				ControllerManager.routesList[`${controller.controllerName}.${route.getMethodName()}`] = route.getPath();

				const {before, after} = route.getMiddlewareHandlers(
					this._config.middleware || []
				);

				this._server.route({
					method       : route.getMethod(),
					handler      : route.getHandlerFactory(),
					url          : route.getPath(),
					preHandler   : async function (req, res) {
						if (before) {
							await before(RequestContext.get());
						}
					},
					onResponse   : async function (req, res) {
						if (after) {
							await after(RequestContext.get());
						}
					},
					errorHandler : async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
						return await this.handleException(RequestContext.get(), error, request, reply);
					}
				});

				const controllerName = ((controller?.controller as any)?.name ?? controller.controller.constructor.name);

				if (config('app.logging.routes', false)) {
					Log.info(`Route Loaded: ${controllerName}(${route.getMethod()} ${route.getPath()})`);
				}

			}
		}
	}

	public registerHooks(hooks: { new(): HookContract }[]) {
		for (let hook of hooks) {
			new hook().register(this._server);
		}
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

		const socketServer = resolve(SocketServer);

		if (socketServer.isEnabled()) {
			await socketServer.initiate(this._server);
		}

		await this._server.listen(this._config.port);

		Log.success('Server is running at http://127.0.0.1:' + this._config.port);
	}

	public setErrorHandling(handler: ErrorHandlerFn) {
		this._customErrorHandler = handler;
	}

	public async handleException(context: RequestContextContract, error: Error | Exception, request: FastifyRequest, reply: FastifyReply) {
		const result = this._exceptionHandler.handle(context.request, error);


		return reply.status(result.code).send(result);

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

	public unload() {
		this._server = null;
		this._config = null;
		this._exceptionHandler = null;
		this._customErrorHandler = null;
	}
}
