import "reflect-metadata";

import {plainToClass} from "class-transformer";
import {IsString, MinLength} from "class-validator";
import {TestingController} from "../App/Http/Controllers/TestingController";
import {App} from "../AppContainer";
import {Config} from "../Config";
import {Server} from "../Core";
import {Controller, controller, ControllerManager, DataTransferObject, DtoValidationException, get, middleware, Middleware} from "../Routing";


const bootApp = async function () {

	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();

	await app.container().resolve(Server).initialise();
}

beforeAll(() => {
	return bootApp();
})

describe('test route service provider', () => {

//	test('route service provider loads controllers', async () => {
//		const app = App.getInstance();
//
//		const controllerInst = app.resolve(TestingController);
//
//		expect(controllerInst).toBeTruthy();
//	});

//	test('test initiating controllers', async () => {
//		const app = App.getInstance();
//
//		expect(
//			ControllerManager.getRoutesForController(app.resolve(TestingController))
//		).toBeDefined();
//	});

	test('test initiating controllers with no methods', async () => {
		const app = App.getInstance();

		expect(ControllerManager.initiateControllers()).toBeDefined()
	});

	test('making request to endpoint using methods & data transfer object', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

			const res = await server._server.inject({
				method  : 'POST',
				url     : '/testing/get',
				payload : {
					something : '12345'
				}
			})

			expect(res.statusCode).toEqual(202);
			expect(res.body).toEqual("some newds");

	});

	test('data transfer object validation fails', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

			const res = await server._server.inject({
				method  : 'POST',
				url     : '/testing/get',
				payload : {
					something : ''
				}
			})

			expect(res.statusCode).toEqual(500);

	});

	test('controller has path metadata defined', async () => {
		const app = App.getInstance();

		const controller = app.resolve(TestingController);

		expect(controller).toBeDefined();

		const meta = ControllerManager.getMeta(controller.constructor);
//		const meta = controller.getMeta();

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
			return GetController;
		}, 'Controllers');

		const getController = app.resolve(GetController);

		expect(ControllerManager.initiateControllers()).toBeDefined();
		expect(getController).toBeDefined();

		const meta = ControllerManager.getMeta(getController.constructor);

		expect(meta.controller.path).toEqual('/test');

		expect(meta.methods[0].path).toEqual('/get');
		expect(meta.methods[0].method).toEqual('GET');
	})

	test('controller method has GET method with middleware', async () => {
		const app = App.getInstance();

		class TestMiddleware extends Middleware {
			public handler(context): Promise<any> {
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
			return GetController;
		}, 'Controllers');

		const getController = app.resolve(GetController);

		expect(getController).toBeDefined();

		const meta = ControllerManager.getMeta(getController.constructor);
//		const meta = getController.getMeta();

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
	test('test hitting route with global middleware', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

			const res = await server._server.inject({
				method  : 'GET',
				url     : '/testing/get',
				payload : {
					something : ''
				}
			})

			expect(res.statusCode).toEqual(500);

	})

	test('test using regular controller from container', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);


			const res = await server._server.inject({
				method  : 'post',
				url     : '/testing/get',
				payload : {
					something : 'yeet'
				}
			})

			expect(res.statusCode).toEqual(202);

	})

});


