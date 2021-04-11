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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.TestingController = void 0;
const class_validator_1 = require("class-validator");
const Controller_1 = require("../../../Controller/Controller");
const ControllerDecorators_1 = require("../../../Controller/ControllerDecorators");
const DataTransferObject_1 = require("../../../DataTransferObject/DataTransferObject");
const Middleware_1 = require("../../../Middleware/Middleware");
const MiddlewareDecorators_1 = require("../../../Middleware/MiddlewareDecorators");
const RouteDecorators_1 = require("../../../Route/RouteDecorators");
class DTO extends DataTransferObject_1.DataTransferObject {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], DTO.prototype, "something", void 0);
class TestMiddleware extends Middleware_1.Middleware {
    handler(request, response) {
        console.log(this);
        return Promise.resolve('hello world');
    }
}
let TestingController = class TestingController extends Controller_1.Controller {
    testGet(dt) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    testMethods(dt) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
__decorate([
    ControllerDecorators_1.method(['POST', 'GET'], '/get'),
    __param(0, RouteDecorators_1.dto()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTO]),
    __metadata("design:returntype", Promise)
], TestingController.prototype, "testGet", null);
__decorate([
    ControllerDecorators_1.method(['GET', 'PUT'], '/testget'),
    __param(0, RouteDecorators_1.dto()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTO]),
    __metadata("design:returntype", Promise)
], TestingController.prototype, "testMethods", null);
TestingController = __decorate([
    MiddlewareDecorators_1.middleware(new TestMiddleware()),
    ControllerDecorators_1.controller('/testing')
], TestingController);
exports.TestingController = TestingController;
//# sourceMappingURL=TestingController.js.map