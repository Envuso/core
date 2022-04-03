import "reflect-metadata";

import {IsString, MinLength} from "class-validator";
import * as fs from "fs";
import * as path from "path";
import {TestingController} from "../App/Http/Controllers/TestingController";
import {User} from "../App/Models/User";
import {App} from "../AppContainer";
import {Authentication} from "../Authentication";
import {
	Controller,
	controller,
	DataTransferObject,
	DtoValidationException,
	get,
	middleware,
	Middleware,
} from "../Routing";
import {Routing} from "../Routing/Route/Routing";
import {Server} from "../Server/Server";
import 'jest-extended';
import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

describe('test route service provider', () => {

	test('route service provider loads controllers', async () => {
		const app            = App.getInstance();
		const controllerInst = app.resolve(TestingController);

		expect(controllerInst).toBeTruthy();
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

		expect(res.statusCode).toEqual(422);

	});

	test('controller has path metadata defined', async () => {
		const app        = App.getInstance();
		const controller = app.resolve(TestingController);
		expect(controller).toBeDefined();

		const meta = Routing.get().getControllerMeta(controller.constructor);

		expect(meta.controller.path).toEqual('/testing');
	});

	test('controller method has GET method', async () => {
		const app = App.getInstance();

		@controller('/test')
		class GetController extends Controller {

			@get('/get')
			getMethod() {}

		}

		app.bind(() => GetController, 'Controllers');

		const getController = app.resolve(GetController);
		expect(getController).toBeDefined();

		Routing.initiate();

		expect(Routing.get().getControllers()).toBeArray();
		expect(Routing.get().getControllers().length).toBeGreaterThan(1);

		const meta = Routing.get().getControllerMeta(getController.constructor);

		expect(meta.controller.path).toEqual('/test');

		expect(meta.methods[0].path).toEqual('/get');
		expect(meta.methods[0].method).toEqual('GET');
	});

	test('controller method has GET method with middleware', async () => {
		const app = App.getInstance();

		class TestMiddleware extends Middleware {
			public handle(context): Promise<any> {
				return Promise.resolve(true);
			}
		}

		@middleware(new TestMiddleware())
		@controller('/test')
		class GetController extends Controller {
			@get('/get')
			getMethod() {}
		}

		app.bind(() => GetController, 'Controllers');

		const getController = app.resolve(GetController);
		expect(getController).toBeDefined();

		const meta = Routing.get().getControllerMeta(getController.constructor);

		expect(meta.controller.path).toEqual('/test');
		expect(meta.methods[0].path).toEqual('/get');
		expect(meta.methods[0].method).toEqual('GET');

		const middlewareMeta = Middleware.getMetadata(meta.controller.target);

		expect(middlewareMeta).toBeDefined();
		expect(middlewareMeta.middlewares).toBeDefined();
		expect(middlewareMeta.middlewares[0]).toEqual(new TestMiddleware());
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

	test('using @param decorator on controller method', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method : 'get',
			url    : '/testing/method-decorator/param/single/yeet',
		});

		expect(res.statusCode).toEqual(202);
		expect(res.body).toEqual(JSON.stringify({first : "yeet"}));

	});

	test('using multiple @param decorator on controller method', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method : 'get',
			url    : '/testing/method-decorator/param/multiple/yeet/doubleyeet',
		});

		expect(res.statusCode).toEqual(202);
		expect(res.body).toEqual(JSON.stringify({first : "yeet", second: "doubleyeet"}));

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

	test('using @user decorator on controller method', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);
		const auth   = app.resolve(Authentication);

		const user = await User.create({
			email : 'yeet@yeet.com'
		});
		await user.refresh();

		const jwt = user.generateToken();

		const res = await server._server.inject({
			method  : 'post',
			url     : '/testing/auth/userdecorator',
			headers : {
				'Authorization' : 'Bearer ' + jwt
			},
			payload : {
				something : "something"
			}
		});

		expect(res.statusCode).toEqual(202);
		expect(res.body).toEqual(JSON.stringify({user}));
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

	test('route model binding failing to return user values', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/rmb/uservals/kdfjfdlkjdklfj',
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		expect(res.statusCode).toEqual(400);

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

		expect(body.data.something).toEqual('something must be longer than or equal to 1 characters');
		expect(res.statusCode).toEqual(422);

	});

	test('dto failed to validate response as GET request', async () => {

		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/failed/dto/get',
			payload : {},
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		const body = JSON.parse(res.body);

		expect(body.data.something).toEqual('something must be longer than or equal to 1 characters');
		expect(res.statusCode).toEqual(422);

	});

	test('uploading a file', async () => {

		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const FormData = require('form-data');
		const form     = new FormData();
		form.append('file', await fs.createReadStream(path.join(process.cwd(), 'logo.svg')));

		const res = await server._server.inject({
			method  : 'post',
			url     : '/testing/file/upload',
			payload : form,
			headers : form.getHeaders()
		});

		const body = JSON.parse(res.body);

		expect(body.extension).toEqual('svg');
		expect(body.mimetype).toEqual('image/svg+xml');
	});

});


