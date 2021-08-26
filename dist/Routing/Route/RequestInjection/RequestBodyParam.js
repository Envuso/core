"use strict";
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
        return request.body;
    }
}
exports.RequestBodyParam = RequestBodyParam;
//# sourceMappingURL=RequestBodyParam.js.map