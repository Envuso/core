"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteUserParam = void 0;
const AppContainer_1 = require("../../../AppContainer");
const Authentication_1 = require("../../../Authentication");
const Common_1 = require("../../../Common");
const MethodParameterDecorator_1 = require("./MethodParameterDecorator");
class RouteUserParam extends MethodParameterDecorator_1.MethodParameterDecorator {
    constructor(parameterName, type, paramIndex) {
        super(type);
        this.parameterName = parameterName;
        this.paramIndex = paramIndex;
    }
    static handleParameter(reflector) {
        const types = Common_1.DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);
        const parameterNames = Common_1.DecoratorHelpers.getParameterNames(reflector.target[reflector.propertyKey]);
        const authedUserParameter = new RouteUserParam(parameterNames[reflector.parameterIndex], types[reflector.parameterIndex], reflector.parameterIndex);
        this.setMetadata(reflector, authedUserParameter);
    }
    static setMetadata(reflector, param) {
        const target = reflector.target[reflector.propertyKey];
        Reflect.defineMetadata(Common_1.METADATA.REQUEST_AUTHENTICATED_USER, param, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(Common_1.METADATA.REQUEST_AUTHENTICATED_USER, target);
    }
    bind(request, response) {
        return AppContainer_1.resolve(Authentication_1.Authentication).user().getUser();
    }
}
exports.RouteUserParam = RouteUserParam;
//# sourceMappingURL=RouteUserParam.js.map