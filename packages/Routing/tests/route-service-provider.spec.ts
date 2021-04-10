import {App} from "@envuso/app";
import {plainToClass} from "class-transformer";
import {IsString, MinLength} from "class-validator";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {TestingController} from "../src/App/Http/Controllers/TestingController";
import {RequestContext} from "../src/Context/RequestContext";
import {Controller} from "../src/Controller/Controller";
import {controller, get} from "../src/Controller/ControllerDecorators";
import {ControllerManager} from "../src/Controller/ControllerManager";
import {DataTransferObject} from "../src/DataTransferObject/DataTransferObject";
import {DtoValidationException} from "../src/DataTransferObject/DtoValidationException";
import {Middleware} from "../src/Middleware/Middleware";
import {middleware} from "../src/Middleware/MiddlewareDecorators";
import fastify from "fastify";

//const fastify = Fastify.fastify();

//jest.mock('fastify');

class Server {
	_server: FastifyInstance;

	async boot() {
		const server = fastify();

		server.addHook('preHandler', (request: FastifyRequest, response: FastifyReply, done) => {
			(new RequestContext(request, response)).bind(done);
		});

//		server.get('/testing/get', async (request, reply) => {
//			return {message : 'yeeeet'};
//		})

		const controllers = ControllerManager.initiateControllers();

		for (let controller of controllers) {
			const routes = controller.routes;

			for (let route of routes) {
//				server.route({
//					url     : route.getRoutePath(),
//					method  : route.methodMeta.method,
//					handler : route.getHandlerFactory()
//				})
				const method = Array.isArray(route.methodMeta.method) ? route.methodMeta.method[0] : route.methodMeta.method;

				server[method.toLowerCase()](route.getRoutePath(), route.getHandlerFactory());
			}
		}

		this._server = server;

//		await server.listen({port : 9999});

		return this._server;
	}
}

const bootApp = async function () {
	const app = await App.bootInstance();
	await app.loadServiceProviders();

	app.container().registerSingleton<Server>(Server);
	await app.container().resolve(Server).boot();
}

beforeAll(() => {
	return bootApp();
})

describe('test route service provider', () => {

	test('route service provider loads controllers', async () => {
		const app = App.getInstance();

		expect(app.resolve(TestingController)).toBeTruthy();
	});

	test('test initiating controllers', async () => {
		const app = App.getInstance();

		expect(
			ControllerManager.getRoutesForController(app.resolve(TestingController))
		).toBeDefined();
	});

	test('test initiating controllers with no methods', async () => {
		const app = App.getInstance();

		expect(ControllerManager.initiateControllers()).toBeDefined()
	});

	test('making request to endpoint using methods & data transfer object', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		try {
			const res = await server._server.inject({
				method  : 'POST',
				url     : '/testing/get',
				payload : {
					something : '12345'
				}
			})

			expect(res.statusCode).toEqual(204);
			expect(res.body).toEqual("{}");

		} catch (error) {
			console.log(error)
		}
	});

	test('data transfer object validation fails', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		try {
			const res = await server._server.inject({
				method  : 'POST',
				url     : '/testing/get',
				payload : {
					something : ''
				}
			})

			expect(res.statusCode).toEqual(500);

		} catch (error) {
			console.log(error)
		}
	});

	test('controller has path metadata defined', async () => {
		const app = App.getInstance();

		const controller = app.resolve(TestingController);

		expect(controller).toBeDefined();

		const meta = controller.getMeta();

		expect(meta.controller.path).toEqual('/testing');
	})

	test('controller method has GET method', async () => {
		const app = App.getInstance();

		@controller('/test')
		class GetController extends Controller {

			@get('/get')
			getMethod() {}

		}

		app.bind(() => {
			return new GetController();
		}, 'Controllers');

		const getController = app.resolve(GetController);

		expect(ControllerManager.initiateControllers()).toBeDefined();
		expect(getController).toBeDefined();

		const meta = getController.getMeta();

		expect(meta.controller.path).toEqual('/test');

		expect(meta.methods[0].path).toEqual('/get');
		expect(meta.methods[0].method).toEqual('GET');
	})

	test('controller method has GET method with middleware', async () => {
		const app = App.getInstance();

		class TestMiddleware extends Middleware {
			public handler(request: FastifyRequest, response: FastifyReply): Promise<any> {
				return Promise.resolve(true);
			}
		}

		@middleware(new TestMiddleware())
		@controller('/test')
		class GetController extends Controller {

			@get('/get')
			getMethod() {}

		}

		app.bind(() => {
			return new GetController();
		}, 'Controllers');

		const getController = app.resolve(GetController);

		expect(getController).toBeDefined();

		const meta = getController.getMeta();

		expect(meta.controller.path).toEqual('/test');
		expect(meta.methods[0].path).toEqual('/get');
		expect(meta.methods[0].method).toEqual('GET');

		const middlewareMeta = Middleware.getMetadata(meta.controller.target);

		expect(middlewareMeta).toBeDefined();
		expect(middlewareMeta.middlewares).toBeDefined();
		expect(middlewareMeta.middlewares[0]).toEqual(new TestMiddleware());
	})


	test('data transfer object validates', async () => {

		class TestDTO extends DataTransferObject {

			@MinLength(1)
			@IsString()
			property: string;

		}

		const dto = plainToClass(TestDTO, {property : ''});

		await dto.validate();

		expect(() => {
			dto.throwIfFailed();
		}).toThrow(new DtoValidationException(dto._validationErrors));

	})

});

