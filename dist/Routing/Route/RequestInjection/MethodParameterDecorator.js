"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodParameterDecorator = void 0;
const tslib_1 = require("tslib");
class MethodParameterDecorator {
    constructor(paramType) {
        this.expectedParamType = paramType;
    }
    /**
     * When we use a decorator, for the route method parameters
     * It will define metadata using reflect as an instance of
     * one of these MethodParameterDecorator classes
     *
     * When we get that metadata, it will be an instance of one of those.
     *
     * @param target
     * @param metadata
     */
    static getMethodMetadata(target, metadata) {
        return Reflect.getMetadata(metadata, target);
    }
    /**
     * This will return the required/formatted data for the route method parameter
     *
     * It's undefined here, as it's base class that others will extend
     *
     * @param request
     * @param response
     */
    bind(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    /**
     * We will define logic in each instance to see if we
     * can bind this instance to the route parameter.
     *
     * @param target
     * @param param
     * @param parameterIndex
     */
    canBind(target, param, parameterIndex) {
        return this.expectedParamType.prototype === param.prototype;
    }
}
exports.MethodParameterDecorator = MethodParameterDecorator;
//# sourceMappingURL=MethodParameterDecorator.js.map