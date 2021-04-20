"use strict";
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
exports.RequestParam = void 0;
const common_1 = require("@envuso/common");
const MethodParameterDecorator_1 = require("./MethodParameterDecorator");
class RequestParam extends MethodParameterDecorator_1.MethodParameterDecorator {
    constructor() {
        super(null);
    }
    static handleParameter(reflector) {
        const paramHandler = new RequestParam();
        this.setMetadata(reflector, paramHandler);
    }
    static setMetadata(reflector, param) {
        const target = reflector.target[reflector.propertyKey];
        Reflect.defineMetadata(common_1.METADATA.REQUEST_METHOD_FASTIFY_REQUEST, param, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(common_1.METADATA.REQUEST_METHOD_FASTIFY_REQUEST, target);
    }
    canBind(target, param, parameterIndex) {
        return this instanceof RequestParam;
    }
    bind(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return request;
        });
    }
}
exports.RequestParam = RequestParam;
//# sourceMappingURL=RequestParam.js.map