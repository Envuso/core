import {ConfigRepository, resolve} from "@envuso/app";
import {Log} from "@envuso/common";
import {ControllerManager, RequestContext, Response, UploadedFile} from "@envuso/routing";
import fastify, {FastifyInstance, FastifyPlugin, FastifyPluginOptions, FastifyReply, FastifyRequest, FastifyServerOptions} from "fastify";
import {FastifyError} from "fastify-error";
import middie from "middie";

export type ErrorHandlerFn = (exception: Error, request: FastifyRequest, reply: FastifyReply) => Promise<Response>;

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
	 * Initialise fastify, add all routes to the application and apply any middlewares
	 */
	public async initialise() {
		if (this._server)
			throw new Error('Server has already been built');

		this._server = fastify(
			resolve(ConfigRepository).get<FastifyServerOptions>('server.fastifyOptions')
		);

		await this._server.register(middie);

		this._server.addHook('preHandler', (request: FastifyRequest, response: FastifyReply, done) => {
			(new RequestContext(request, response)).bind(done);
		});

		this._server.addHook('preHandler', async (request: FastifyRequest, response: FastifyReply) => {
			if (request.isMultipart())
				await UploadedFile.addToRequest(request);
		})

		this._server.addHook('onError', (request, reply, error, done) => {
			Log.error(error.message);
			console.error(error);

			done();
		});

		this.registerPlugins();
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

							await handler(context)
						}
					},
					errorHandler : async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
						await this.handleException(error, request, reply);
					}
				})

				Log.info(`Route Loaded: ${controller.constructor.name}(${route.getMethod()} ${route.getPath()})`);
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
		const plugins = resolve(ConfigRepository)
			.get<Array<[FastifyPlugin, FastifyPluginOptions]>>(
				'server.fastifyPlugins'
			);

		plugins.forEach(plugin => {
			this._server.register(plugin[0], plugin[1]);
		})
	}

	/**
	 * Begin listening for connections
	 */
	async listen() {
		await this._server.listen(3000);

		Log.success('Server is running at http://127.0.0.1:3000');
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
