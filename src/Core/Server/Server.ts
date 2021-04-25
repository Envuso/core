import {Cors} from "aws-sdk/clients/apigatewayv2";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import fastify, {FastifyInstance, FastifyPlugin, FastifyPluginOptions, FastifyReply, FastifyRequest, FastifyServerOptions} from "fastify";
import {FastifyCorsOptions} from "fastify-cors";
import {FastifyError} from "fastify-error";
import middie from "middie";
import {ConfigRepository, resolve} from "../../AppContainer";
import {Log} from "../../Common";
import {ControllerManager, RequestContext, Response, UploadedFile} from "../../Routing";

export type ErrorHandlerFn = (exception: Error, request: FastifyRequest, reply: FastifyReply) => Promise<Response>;

interface CorsConfiguration {
	enabled: boolean;
	options: FastifyCorsOptions;
}


interface ServerConfiguration {
	port: number;
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

		// Handled just before our controllers receive/process the request
		// This handler needs to work by it-self to provide the context
		this._server.addHook('preHandler', (request: FastifyRequest, response: FastifyReply, done) => {
			//If this request is a cors preflight request... we don't want to handle our internal logic.
			if ((request as any).corsPreflightEnabled) {
				done();
				return;
			}

			(new RequestContext(request, response)).bind(done);
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

		this._server.addHook('onError', (request, reply, error, done) => {
			Log.error(error.message);
			console.error(error);

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

		//		this._server.register((instance, opts, done) => {

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
						await this.handleException(error, request, reply);
					}
				});

				Log.info(`Route Loaded: ${controller.controller.constructor.name}(${route.getMethod()} ${route.getPath()})`);
			}
		}

		//			done();
		//		})

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
		await this._server.listen(this._config.port);

		Log.success('Server is running at http://127.0.0.1:' + this._config.port);
	}

	public setErrorHandling(handler: ErrorHandlerFn) {
		this._customErrorHandler = handler;
	}

	private async handleException(error: Error, request: FastifyRequest, reply: FastifyReply) {
		if (!this._customErrorHandler) {
			return reply.status(500).send({
				message : error.message,
				code    : 500,
			});
		}

		const response: Response = await this._customErrorHandler(error, request, reply);

		response.send();
	}
}
