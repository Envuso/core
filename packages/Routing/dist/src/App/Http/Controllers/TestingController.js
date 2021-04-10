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
const Controller_1 = require("../../../Controller/Controller");
const ControllerDecorators_1 = require("../../../Controller/ControllerDecorators");
const DataTransferObject_1 = require("../../../DataTransferObject/DataTransferObject");
const RouteDecorators_1 = require("../../../Route/RouteDecorators");
class DTO extends DataTransferObject_1.DataTransferObject {
}
let TestingController = class TestingController extends Controller_1.Controller {
    testGet(dt) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
__decorate([
    ControllerDecorators_1.get('/get'),
    __param(0, RouteDecorators_1.dto()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTO]),
    __metadata("design:returntype", Promise)
], TestingController.prototype, "testGet", null);
TestingController = __decorate([
    ControllerDecorators_1.controller('/testing')
], TestingController);
exports.TestingController = TestingController;
//# sourceMappingURL=TestingController.js.map