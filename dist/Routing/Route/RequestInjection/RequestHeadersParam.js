"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHeadersParam = void 0;
const tslib_1 = require("tslib");
const Common_1 = require("../../../Common");
const MethodParameterDecorator_1 = require("./MethodParameterDecorator");
class RequestHeadersParam extends MethodParameterDecorator_1.MethodParameterDecorator {
    constructor(parameterIndex) {
        super(null);
        this.parameterIndex = parameterIndex;
    }
    static handleParameter(reflector) {
        this.setMetadata(reflector, new RequestHeadersParam(reflector.parameterIndex));
    }
    static setMetadata(reflector, dtoParam) {
        const target = reflector.target[reflector.propertyKey];
        Reflect.defineMetadata(Common_1.METADATA.REQUEST_METHOD_HEADERS, dtoParam, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(Common_1.METADATA.REQUEST_METHOD_HEADERS, target);
    }
    canBind(target, param, parameterIndex) {
        return parameterIndex === this.parameterIndex;
    }
    bind(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return request.headers;
        });
    }
}
exports.RequestHeadersParam = RequestHeadersParam;
//# sourceMappingURL=RequestHeadersParam.js.map