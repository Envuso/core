import {Config} from "@Config";
import console from 'chalk-console';
import fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {inject, injectable} from "inversify";
import middie from "middie";
import {Log} from "@Core";
import {METADATA} from "../../../DecoratorData";
import {ControllerMethodMetadata} from "../../../Decorators/Route";
import {HttpContext} from "../Context/HttpContext";
import {Controller} from "../Controller/Controller";
import {ControllerServiceProvider} from "../Controller/ControllerServiceProvider";
import {Route} from "../Controller/Route";

@injectable()
export class Server {

	/**
	 * Our fastify instance for the server
	 *
	 * @private
	 */
	private _app: FastifyInstance;

	/**
	 * Injected controller service provider
	 *
	 * @private
	 */
	@inject(ControllerServiceProvider)
	private controllerProvider: ControllerServiceProvider

	/**
	 * Initialise fastify, add all routes to the application and apply any middlewares
	 */
	public async build() {
		if (this._app)
			throw new Error('Server has already been built');

		this._app = fastify({
			//logger : true
		});

		await this._app.register(middie);

		this._app.addHook('onError', (request, reply, error, done) => {
			console.error(error);

			done();
		});

		// The very first middleware to be invoked
		// it creates a new httpContext and attaches it to the
		// current request as metadata using Reflect
//		this._app.addHook('preHandler', async (request: FastifyRequest, response: FastifyReply) => {
//
//
//			Reflect.defineMetadata(
//				METADATA.HTTP_CONTEXT,
//				(new HttpContext(request, response)).prepare(),
//				request
//			);
//		});

		this._app.addHook('preHandler', (request: FastifyRequest, response: FastifyReply, done) => {
			(new HttpContext(request, response)).bind(done);
		});

		this.registerPlugins();

		this.registerControllers();

		return this._app;
	}

	/**
	 * Register all controller routes inside fastify
	 *
	 * @private
	 */
	private registerControllers() {

		this._app.register((instance, opts, done) => {

			this.controllerProvider.allControllers().forEach((controller: Controller) => {

				const controllerMetadata = controller.getMetadata();
				const methodMetadata     = controller.getMethodMetadata();

				if (controllerMetadata && methodMetadata) {

					methodMetadata.forEach((metadata: ControllerMethodMetadata) => {

						const appRoute = new Route(
							controller.constructor,
							controllerMetadata,
							methodMetadata,
							metadata
						);

						Log.info(`Route Loaded: ${controller.constructor.name}(${metadata.method.toUpperCase()} ${appRoute.getRoutePath()})`);

						this._app[metadata.method](...appRoute.getFastifyRouteOptions());
					});
				}
			});

			done();
		})

	}

	cleanUpMetadata() {
		Reflect.defineMetadata(
			METADATA.CONTROLLER,
			[],
			Reflect
		);
	}

	private registerPlugins() {
		const providers = Config.serverProviders;

		providers.forEach(provider => {
			this._app.register(provider[0], provider[1]);
		})
	}

	get app() {
		return this._app;
	}
}
