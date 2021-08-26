"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteParameterParam = void 0;
const Common_1 = require("../../../Common");
const MethodParameterDecorator_1 = require("./MethodParameterDecorator");
class RouteParameterParam extends MethodParameterDecorator_1.MethodParameterDecorator {
    constructor(parameterName, type, paramIndex) {
        super(type);
        this.parameterName = parameterName;
        this.paramIndex = paramIndex;
    }
    static handleParameter(reflector) {
        const types = Common_1.DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);
        const parameterNames = Common_1.DecoratorHelpers.getParameterNames(reflector.target[reflector.propertyKey]);
        const routeParameterParam = new RouteParameterParam(parameterNames[reflector.parameterIndex], types[reflector.parameterIndex], reflector.parameterIndex);
        this.setMetadata(reflector, routeParameterParam);
    }
    static setMetadata(reflector, param) {
        const target = reflector.target[reflector.propertyKey];
        Reflect.defineMetadata(Common_1.METADATA.REQUEST_METHOD_ROUTE_PARAMETER, param, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(Common_1.METADATA.REQUEST_METHOD_ROUTE_PARAMETER, target);
    }
    canBind(target, param, parameterIndex) {
        if (parameterIndex !== this.paramIndex) {
            return false;
        }
        return this.expectedParamType === param;
    }
    bind(request, response) {
        const paramValue = request.params[this.parameterName];
        const param = this.expectedParamType(paramValue);
        return param !== null && param !== void 0 ? param : null;
    }
}
exports.RouteParameterParam = RouteParameterParam;
//# sourceMappingURL=RouteParameterParam.js.map