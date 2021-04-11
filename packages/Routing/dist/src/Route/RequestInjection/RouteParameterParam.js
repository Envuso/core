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
exports.RouteParameterParam = void 0;
const common_1 = require("@envuso/common");
const MethodParameterDecorator_1 = require("./MethodParameterDecorator");
class RouteParameterParam extends MethodParameterDecorator_1.MethodParameterDecorator {
    constructor(parameterName, type, paramIndex) {
        super(type);
        this.parameterName = parameterName;
        this.paramIndex = paramIndex;
    }
    static handleParameter(reflector) {
        const types = common_1.DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);
        const parameterNames = common_1.DecoratorHelpers.getParameterNames(reflector.target[reflector.propertyKey]);
        const routeParameterParam = new RouteParameterParam(parameterNames[reflector.parameterIndex], types[reflector.parameterIndex], reflector.parameterIndex);
        this.setMetadata(reflector, routeParameterParam);
    }
    static setMetadata(reflector, param) {
        const target = reflector.target[reflector.propertyKey];
        Reflect.defineMetadata(common_1.METADATA.REQUEST_METHOD_ROUTE_PARAMETER, param, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(common_1.METADATA.REQUEST_METHOD_ROUTE_PARAMETER, target);
    }
    canBind(target, param, parameterIndex) {
        if (parameterIndex !== this.paramIndex) {
            return false;
        }
        return this.expectedParamType === param;
    }
    bind(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const paramValue = request.params[this.parameterName];
            const param = this.expectedParamType(paramValue);
            return param !== null && param !== void 0 ? param : null;
        });
    }
}
exports.RouteParameterParam = RouteParameterParam;
//# sourceMappingURL=RouteParameterParam.js.map