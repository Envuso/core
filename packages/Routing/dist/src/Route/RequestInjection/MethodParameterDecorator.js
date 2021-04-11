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
exports.MethodParameterDecorator = void 0;
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
        return __awaiter(this, void 0, void 0, function* () {
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