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
exports.TestController = void 0;
const routing_1 = require("@envuso/routing");
const class_validator_1 = require("class-validator");
class dtoshit extends routing_1.DataTransferObject {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], dtoshit.prototype, "something", void 0);
let TestController = class TestController extends routing_1.Controller {
    /**
     * TYPE CASTING THE METHOD LIKE
     * (REQ: FASTIFYREQUEST) WILL BREAK FUCKING EVERYTHING
     *
     * @TODO: FIX PLS
     */
    testMethod(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return { id: routing_1.request().fastifyRequest.id, dto };
        });
    }
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = routing_1.request().file('file');
            const upload = yield file.store('testing');
            return { message: 'woot' };
        });
    }
};
__decorate([
    routing_1.post('/test'),
    __param(0, routing_1.dto()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtoshit]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "testMethod", null);
__decorate([
    routing_1.post('/upload'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "upload", null);
TestController = __decorate([
    routing_1.controller('/lel')
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=TestController.js.map