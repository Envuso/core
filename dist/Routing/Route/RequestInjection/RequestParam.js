"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParam = void 0;
const tslib_1 = require("tslib");
const Common_1 = require("../../../Common");
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return request;
        });
    }
}
exports.RequestParam = RequestParam;
//# sourceMappingURL=RequestParam.js.map