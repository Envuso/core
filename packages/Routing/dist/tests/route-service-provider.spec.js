"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@envuso/app");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const TestingController_1 = require("../src/App/Http/Controllers/TestingController");
const RequestContext_1 = require("../src/Context/RequestContext");
const Controller_1 = require("../src/Controller/Controller");
const ControllerDecorators_1 = require("../src/Controller/ControllerDecorators");
const ControllerManager_1 = require("../src/Controller/ControllerManager");
const DataTransferObject_1 = require("../src/DataTransferObject/DataTransferObject");
const DtoValidationException_1 = require("../src/DataTransferObject/DtoValidationException");
const Middleware_1 = require("../src/Middleware/Middleware");
const MiddlewareDecorators_1 = require("../src/Middleware/MiddlewareDecorators");
const fastify_1 = __importDefault(require("fastify"));
//const fastify = Fastify.fastify();
//jest.mock('fastify');
class Server {
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            const server = fastify_1.default();
            server.addHook('preHandler', (request, response, done) => {
                (new RequestContext_1.RequestContext(request, response)).bind(done);
            });
            //		server.get('/testing/get', async (request, reply) => {
            //			return {message : 'yeeeet'};
            //		})
            const controllers = ControllerManager_1.ControllerManager.initiateControllers();
            for (let controller of controllers) {
                const routes = controller.routes;
                for (let route of routes) {
                    //				server.route({
                    //					url     : route.getRoutePath(),
                    //					method  : route.methodMeta.method,
                    //					handler : route.getHandlerFactory()
                    //				})
                    const method = Array.isArray(route.methodMeta.method) ? route.methodMeta.method[0] : route.methodMeta.method;
                    const preHandler = route.getMiddlewareHandler();
                    server[method.toLowerCase()](route.getPath(), {
                        preHandler: function (req, res) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (preHandler) {
                                    yield preHandler(req, res);
                                }
                            });
                        }
                    }, route.getHandlerFactory());
                }
            }
            this._server = server;
            //		await server.listen({port : 9999});
            return this._server;
        });
    }
}
const bootApp = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield app_1.App.bootInstance();
        yield app.loadServiceProviders();
        app.container().registerSingleton(Server);
        yield app.container().resolve(Server).boot();
    });
};
beforeAll(() => {
    return bootApp();
});
describe('test route service provider', () => {
    test('route service provider loads controllers', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        expect(app.resolve(TestingController_1.TestingController)).toBeTruthy();
    }));
    test('test initiating controllers', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        expect(ControllerManager_1.ControllerManager.getRoutesForController(app.resolve(TestingController_1.TestingController))).toBeDefined();
    }));
    test('test initiating controllers with no methods', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        expect(ControllerManager_1.ControllerManager.initiateControllers()).toBeDefined();
    }));
    test('making request to endpoint using methods & data transfer object', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const server = app.container().resolve(Server);
        try {
            const res = yield server._server.inject({
                method: 'POST',
                url: '/testing/get',
                payload: {
                    something: '12345'
                }
            });
            expect(res.statusCode).toEqual(204);
            expect(res.body).toEqual("{}");
        }
        catch (error) {
            console.log(error);
        }
    }));
    test('data transfer object validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const server = app.container().resolve(Server);
        try {
            const res = yield server._server.inject({
                method: 'POST',
                url: '/testing/get',
                payload: {
                    something: ''
                }
            });
            expect(res.statusCode).toEqual(500);
        }
        catch (error) {
            console.log(error);
        }
    }));
    test('controller has path metadata defined', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const controller = app.resolve(TestingController_1.TestingController);
        expect(controller).toBeDefined();
        const meta = controller.getMeta();
        expect(meta.controller.path).toEqual('/testing');
    }));
    test('controller method has GET method', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        let GetController = class GetController extends Controller_1.Controller {
            getMethod() { }
        };
        __decorate([
            ControllerDecorators_1.get('/get'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], GetController.prototype, "getMethod", null);
        GetController = __decorate([
            ControllerDecorators_1.controller('/test')
        ], GetController);
        app.bind(() => {
            return new GetController();
        }, 'Controllers');
        const getController = app.resolve(GetController);
        expect(ControllerManager_1.ControllerManager.initiateControllers()).toBeDefined();
        expect(getController).toBeDefined();
        const meta = getController.getMeta();
        expect(meta.controller.path).toEqual('/test');
        expect(meta.methods[0].path).toEqual('/get');
        expect(meta.methods[0].method).toEqual('GET');
    }));
    test('controller method has GET method with middleware', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        class TestMiddleware extends Middleware_1.Middleware {
            handler(request, response) {
                return Promise.resolve(true);
            }
        }
        let GetController = class GetController extends Controller_1.Controller {
            getMethod() { }
        };
        __decorate([
            ControllerDecorators_1.get('/get'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], GetController.prototype, "getMethod", null);
        GetController = __decorate([
            MiddlewareDecorators_1.middleware(new TestMiddleware()),
            ControllerDecorators_1.controller('/test')
        ], GetController);
        app.bind(() => {
            return new GetController();
        }, 'Controllers');
        const getController = app.resolve(GetController);
        expect(getController).toBeDefined();
        const meta = getController.getMeta();
        expect(meta.controller.path).toEqual('/test');
        expect(meta.methods[0].path).toEqual('/get');
        expect(meta.methods[0].method).toEqual('GET');
        const middlewareMeta = Middleware_1.Middleware.getMetadata(meta.controller.target);
        expect(middlewareMeta).toBeDefined();
        expect(middlewareMeta.middlewares).toBeDefined();
        expect(middlewareMeta.middlewares[0]).toEqual(new TestMiddleware());
    }));
    test('data transfer object validates', () => __awaiter(void 0, void 0, void 0, function* () {
        class TestDTO extends DataTransferObject_1.DataTransferObject {
        }
        __decorate([
            class_validator_1.MinLength(1),
            class_validator_1.IsString(),
            __metadata("design:type", String)
        ], TestDTO.prototype, "property", void 0);
        const dto = class_transformer_1.plainToClass(TestDTO, { property: '' });
        yield dto.validate();
        expect(() => {
            dto.throwIfFailed();
        }).toThrow(new DtoValidationException_1.DtoValidationException(dto._validationErrors));
    }));
    test('test hitting route with global middleware', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const server = app.container().resolve(Server);
        try {
            const res = yield server._server.inject({
                method: 'GET',
                url: '/testing/get',
                payload: {
                    something: ''
                }
            });
            expect(res.statusCode).toEqual(500);
        }
        catch (error) {
            console.log(error);
        }
    }));
});
//# sourceMappingURL=route-service-provider.spec.js.map