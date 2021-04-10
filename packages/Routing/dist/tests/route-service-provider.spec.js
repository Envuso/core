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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@envuso/app");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const TestingController_1 = require("../src/App/Http/Controllers/TestingController");
const Controller_1 = require("../src/Controller/Controller");
const ControllerDecorators_1 = require("../src/Controller/ControllerDecorators");
const DataTransferObject_1 = require("../src/DataTransferObject/DataTransferObject");
const DtoValidationException_1 = require("../src/DataTransferObject/DtoValidationException");
const Middleware_1 = require("../src/Middleware/Middleware");
const MiddlewareDecorators_1 = require("../src/Middleware/MiddlewareDecorators");
const bootApp = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield app_1.App.bootInstance();
        yield app.loadServiceProviders();
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
        expect(getController).toBeDefined();
        const meta = getController.getMeta();
        expect(meta.controller.path).toEqual('/test');
        expect(meta.methods[0].path).toEqual('/get');
        expect(meta.methods[0].method).toEqual('get');
    }));
    test('controller method has GET method', () => __awaiter(void 0, void 0, void 0, function* () {
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
        expect(meta.methods[0].method).toEqual('get');
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
});
//# sourceMappingURL=route-service-provider.spec.js.map