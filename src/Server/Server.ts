import {ClassTransformOptions} from "class-transformer/types/interfaces";
import fastify, {FastifyInstance, FastifyPlugin, FastifyPluginOptions, FastifyReply, FastifyRequest, FastifyServerOptions} from "fastify";
import {FastifyCorsOptions} from "fastify-cors";
import {FastifyError} from "fastify-error";
import middie from "middie";
import {ConfigRepository, resolve} from "../AppContainer";
import {Exception, Log} from "../Common";
import {ControllerManager, Middleware, RequestContext, Response, UploadedFile} from "../Routing";
import {SocketServer} from "../Sockets/SocketServer";

export type ErrorHandlerFn = (exception: Error, request: FastifyRequest, reply: FastifyReply) => Promise<Response>;

interface CorsConfiguration {
	enabled: boolean;
	options: FastifyCorsOptions
}


interface ServerConfiguration {
	port: number;
	middleware: (new () => Middleware)[]
	cors: CorsConfiguration;
	fastifyPlugins: Array<[FastifyPlugin, FastifyPluginOptions]>;
	fastifyOptions: FastifyServerOptions;
	responseSerialization: ClassTransformOptions;
}

export class Server {

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
	private _customErrorHandler: ErrorHandlerFn | null = null;

	/**
	 * Configuration from the Server.ts config file
	 *
	 * @type {ServerConfiguration}
	 * @private
	 */
	private _config: ServerConfiguration;

	/**
	 * Initialise fastify, add all routes to the application and apply any middlewares
	 */
	public async initialise() {
		if (this._server)
			throw new Error('Server has already been built');

		this._config = resolve(ConfigRepository).get<ServerConfiguration>('server');

		this._server = fastify(this._config.fastifyOptions);

		await this._server.register(middie);

		this.registerPlugins();
		this._server.addHook('onRequest', (r, re, done) => {
			console.time('REQUEST TIME');
			done();
		});
		// Handled just before our controllers receive/process the request
		// This handler needs to work by it-self to provide the context
		this._server.addHook('preHandler', (request: FastifyRequest, response: FastifyReply, done) => {
			//If this request is a cors preflight request... we don't want to handle our internal logic.
			if ((request as any).corsPreflightEnabled) {
				done();
				return;
			}

			(new RequestContext(request, response)).bindToFastify(done);
		});

		// Handled just before our controllers receive/process the request
		this._server.addHook('preHandler', async (request: FastifyRequest, response: FastifyReply) => {
			//If this request is a cors preflight request... we don't want to handle our internal logic.
			if ((request as any).corsPreflightEnabled) {
				return;
			}

			await RequestContext.get().initiateForRequest();

			if (request.isMultipart())
				await UploadedFile.addToRequest(request);
		});

		// Handled before the response is sent to the client
		this._server.addHook('onSend', async (request: FastifyRequest, response: FastifyReply) => {
			//If this request is a cors preflight request... we don't want to handle our internal logic.
			if ((request as any).corsPreflightEnabled) {
				return;
			}

			RequestContext.response().cookieJar().setCookiesOnResponse();
		});

		// Handled after the response has been sent to the client
		this._server.addHook('onResponse', async (request: FastifyRequest, response: FastifyReply) => {
			//If this request is a cors preflight request... we don't want to handle our internal logic.
			if ((request as any).corsPreflightEnabled) {
				return;
			}

			if (RequestContext.isUsingSession())
				await RequestContext.session().save();
		});

		this._server.addHook('onResponse', (r, re, done) => {
			console.timeEnd('REQUEST TIME');
			done();
		});
		this._server.addHook('onError', (request, reply, error, done) => {
			Log.exception(error.message, error);

			done();
		});

		this.registerControllers();

		return this._server;
	}

	/**
	 * Register all controller routes inside fastify
	 *
	 * @private
	 */
	private registerControllers() {

		const controllers = ControllerManager.initiateControllers();

		for (let controller of controllers) {
			const routes = controller.routes;

			for (let route of routes) {
				const handler = route.getMiddlewareHandler();
				this._server.route({
					method       : route.getMethod(),
					handler      : route.getHandlerFactory(),
					url          : route.getPath(),
					preHandler   : async function (req, res) {
						if (handler) {
							const context = RequestContext.get();

							await handler(context);
						}
					},
					errorHandler : async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
						return await this.handleException(error, request, reply);
					}
				});

				const controllerName = ((controller?.controller as any)?.name ?? controller.controller.constructor.name);

				Log.info(`Route Loaded: ${controllerName}(${route.getMethod()} ${route.getPath()})`);
			}
		}
	}

	/**
	 * This will register app Fastify Plugins from Config/App.ts > fastifyPlugins
	 *
	 * @private
	 */
	private registerPlugins() {

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

		this._config.fastifyPlugins.forEach(plugin => {
			this._server.register(plugin[0], plugin[1]);
		});
	}

	/**
	 * Begin listening for connections
	 */
	async listen() {

		const socketServer = resolve(SocketServer);

		if(socketServer.isEnabled()){
			await socketServer.initiate(this._server)
		}

//		if (this._config.websocketsEnabled) {
//			this._socketServer = new SocketServer();
//			await this._socketServer.prepareIo(this._server, this._config.cors);
//		}

		await this._server.listen(this._config.port);

		Log.success('Server is running at http://127.0.0.1:' + this._config.port);
	}

	public setErrorHandling(handler: ErrorHandlerFn) {
		this._customErrorHandler = handler;
	}

	private async handleException(error: Error | Exception, request: FastifyRequest, reply: FastifyReply) {

		if (!this._customErrorHandler) {
			const response = (error instanceof Exception) ? error.response : {
				message : error.message,
				code    : 500,
			};
			const code     = (error instanceof Exception) ? error.code : 500;

			return reply.status(code).send(response);
		}

		const response: Response = await this._customErrorHandler(error, request, reply);

		response.send();
	}
}
