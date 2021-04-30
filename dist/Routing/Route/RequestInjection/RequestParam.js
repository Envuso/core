"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParam = void 0;
const Common_1 = require("../../../Common");
const RequestContext_1 = require("../../Context/RequestContext");
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
        Reflect.defineMetadata(Common_1.METADATA.REQUEST_METHOD_FASTIFY_REQUEST, param, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(Common_1.METADATA.REQUEST_METHOD_FASTIFY_REQUEST, target);
    }
    canBind(target, param, parameterIndex) {
        return this instanceof RequestParam;
    }
    bind(request, response) {
        return RequestContext_1.RequestContext.get().request;
    }
}
exports.RequestParam = RequestParam;
//# sourceMappingURL=RequestParam.js.map