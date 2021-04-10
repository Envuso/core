import {App} from "@envuso/app";
import {plainToClass} from "class-transformer";
import {IsString, MinLength} from "class-validator";
import {FastifyReply, FastifyRequest} from "fastify";
import {TestingController} from "../src/App/Http/Controllers/TestingController";
import {Controller} from "../src/Controller/Controller";
import {controller, get} from "../src/Controller/ControllerDecorators";
import {ControllerManager} from "../src/Controller/ControllerManager";
import {DataTransferObject} from "../src/DataTransferObject/DataTransferObject";
import {DtoValidationException} from "../src/DataTransferObject/DtoValidationException";
import {Middleware} from "../src/Middleware/Middleware";
import {middleware} from "../src/Middleware/MiddlewareDecorators";
import {RouteManager} from "../src/Route/RouteManager";


const bootApp = async function () {
	const app = await App.bootInstance();
	await app.loadServiceProviders();
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
	test('getting handler factory for controller method', async () => {
		const app = App.getInstance();

		const controllers = ControllerManager.initiateControllers();

		const controller = controllers[1];

		const handler = controller.routes[0].getHandlerFactory();

		const res = await handler();

		console.log(res);
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

		const controllerss = ControllerManager.initiateControllers();

		expect(getController).toBeDefined();

		const meta = getController.getMeta();

		expect(meta.controller.path).toEqual('/test');

		expect(meta.methods[0].path).toEqual('/get');
		expect(meta.methods[0].method).toEqual('get');
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
		expect(meta.methods[0].method).toEqual('get');

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

