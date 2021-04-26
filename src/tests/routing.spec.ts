import "reflect-metadata";

import {plainToClass} from "class-transformer";
import {IsString, MinLength} from "class-validator";
import {TestingController} from "../App/Http/Controllers/TestingController";
import {User} from "../App/Models/User";
import {App} from "../AppContainer";
import {Config} from "../Config";
import {Server} from "../Core";
import {Controller, controller, ControllerManager, DataTransferObject, DtoValidationException, get, middleware, Middleware} from "../Routing";


const bootApp = async function () {

	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();

	await app.container().resolve(Server).initialise();
};

beforeAll(() => {
	return bootApp();
});

describe('test route service provider', () => {

	//	test('route service provider loads controllers', async () => {
	//		const app = App.getInstance();
	//
	//		const controllerInst = app.resolve(TestingController);
	//
	//		expect(controllerInst).toBeTruthy();
	//	});

	//	test('initiating controllers', async () => {
	//		const app = App.getInstance();
	//
	//		expect(
	//			ControllerManager.getRoutesForController(app.resolve(TestingController))
	//		).toBeDefined();
	//	});

	test('test initiating controllers with no methods', async () => {
		const app = App.getInstance();

		expect(ControllerManager.initiateControllers()).toBeDefined();
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
		});

		expect(res.statusCode).toEqual(202);
		expect(res.body).toEqual("some info");

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
		});

		expect(res.statusCode).toEqual(500);

	});

	test('controller has path metadata defined', async () => {
		const app = App.getInstance();

		const controller = app.resolve(TestingController);

		expect(controller).toBeDefined();

		const meta = ControllerManager.getMeta(controller.constructor);
		//		const meta = controller.getMeta();

		expect(meta.controller.path).toEqual('/testing');
	});

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
	});

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
	});

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

	});
	test('hitting route with global middleware', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method  : 'GET',
			url     : '/testing/get',
			payload : {
				something : ''
			}
		});

		expect(res.statusCode).toEqual(500);

	});

	test('using regular controller from container', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);


		const res = await server._server.inject({
			method  : 'post',
			url     : '/testing/get',
			payload : {
				something : 'yeet'
			}
		});

		expect(res.statusCode).toEqual(202);

	});

	test('using @query decorator on controller method', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method : 'get',
			url    : '/testing/decorator/param',
			query  : {
				message : 'hello world'
			}
		});

		expect(res.statusCode).toEqual(202);
		expect(res.body).toEqual('hello world');

	});

	test('route model binding returning user object', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const user = await User.create<User>({something : 'woop'});

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/rmb/userobject/' + user._id,
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		const body: any = JSON.parse(res.body);

		expect(body._id).toEqual(user._id.toString());
		expect(body.something).toEqual(user.something);
		expect(res.statusCode).toEqual(202);

	});

	test('route model binding returning user object without response() helper', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const user = await User.create<User>({something : 'woop'});

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/rmb/userobject/obj/' + user._id,
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		const body: any = JSON.parse(res.body);

		expect(body._id).toEqual(user._id.toString());
		expect(body.something).toEqual(user.something);
		expect(res.statusCode).toEqual(202);

	});

	test('route model binding returning object user values', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const user = await User.create<User>({something : 'woop'});

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/rmb/uservalsobj/' + user._id,
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		const body: any = JSON.parse(res.body);

		expect(body._id).toEqual(user._id.toString());
		expect(res.statusCode).toEqual(202);

	});

	test('route model binding returning user values', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const user = await User.create<User>({something : 'woop'});

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/rmb/uservals/' + user._id,
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		const body: any = JSON.parse(res.body);

		expect(body._id).toEqual(user._id.toString());
		expect(res.statusCode).toEqual(202);

	});

	test('body decorator returning value', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method  : 'post',
			url     : '/testing/body',
			payload : {
				value : 'testing'
			},
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		expect(res.body).toEqual('testing');
		expect(res.statusCode).toEqual(202);

	});

	test('dto failed to validate response', async () => {

		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method  : 'post',
			url     : '/testing/failed/dto',
			payload : {},
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		const body = JSON.parse(res.body);

		expect(body.errors.something).toEqual('something must be longer than or equal to 1 characters');
		expect(res.statusCode).toEqual(500);

	});

});


