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
exports.RequestBodyParam = void 0;
const Common_1 = require("../../../Common");
const MethodParameterDecorator_1 = require("./MethodParameterDecorator");
class RequestBodyParam extends MethodParameterDecorator_1.MethodParameterDecorator {
    constructor(parameterIndex) {
        super(null);
        this.parameterIndex = parameterIndex;
    }
    static handleParameter(reflector, validateOnRequest = true) {
        this.setMetadata(reflector, new RequestBodyParam(reflector.parameterIndex));
    }
    static setMetadata(reflector, dtoParam) {
        const target = reflector.target[reflector.propertyKey];
        Reflect.defineMetadata(Common_1.METADATA.REQUEST_METHOD_BODY, dtoParam, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(Common_1.METADATA.REQUEST_METHOD_BODY, target);
    }
    canBind(target, param, parameterIndex) {
        return parameterIndex === this.parameterIndex;
    }
    bind(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return request.body;
        });
    }
}
exports.RequestBodyParam = RequestBodyParam;
//# sourceMappingURL=RequestBodyParam.js.map