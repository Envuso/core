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
exports.RouteManager = void 0;
const common_1 = require("@envuso/common");
const Log_1 = require("@envuso/common/dist/src/Logger/Log");
const MethodParameterDecorator_1 = require("./RequestInjection/MethodParameterDecorator");
class RouteManager {
    /**
     * Reflect Metadata keys that we'll use for method parameter handling. We
     * basically iterate through these to see if they're applied to the method
     * and if they are, it will return a {@see MethodParameterDecorator} instance
     */
    static methodParamTypesForInjection() {
        return [
            common_1.METADATA.REQUEST_METHOD_DTO,
            common_1.METADATA.REQUEST_METHOD_FASTIFY_REQUEST,
            common_1.METADATA.REQUEST_METHOD_ROUTE_PARAMETER,
            common_1.METADATA.REQUEST_METHOD_QUERY_PARAMETER,
            common_1.METADATA.REQUEST_METHOD_BODY,
            common_1.METADATA.REQUEST_METHOD_HEADERS
        ];
    }
    /**
     * Parse all of the types for the requested controller method.
     * We'll then see if we can apply any decorator/DI to these parameters.
     *
     * Handles things like Route model binding, dto resolving & validating,
     * injecting request, response etc.
     *
     * @param request
     * @param response
     * @param route
     */
    static parametersForRoute(request, response, route) {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = route.getMethodParameterTypes();
            if (!parameters.length) {
                return [];
            }
            const parameterArgs = [];
            for (let index in route.methodMeta.parameters) {
                const parameter = route.methodMeta.parameters[index];
                //@TODO: Add route model binding back here...
                /*if (parameter.type.prototype instanceof ModelEntity) {
                 const identifier = request.params[parameter.name];
                 const model      = await parameter.type.query().findById(new ObjectId(identifier)) ?? null;
    
                 paramArgs.push(model);
    
                 continue;
                 }*/
                for (let metadataKey of this.methodParamTypesForInjection()) {
                    const methodMeta = MethodParameterDecorator_1.MethodParameterDecorator.getMethodMetadata(route.methodMeta.target[route.methodMeta.key], metadataKey);
                    if (!methodMeta) {
                        Log_1.Log.info('Param ' + route.methodMeta.key + ' doesnt have meta for injector: ' + metadataKey);
                        continue;
                    }
                    const canBind = methodMeta.canBind(route.methodMeta.target[route.methodMeta.key], parameter.type, Number(index));
                    if (canBind) {
                        parameterArgs.push(yield methodMeta.bind(request, response));
                        break;
                    }
                }
            }
            return parameterArgs;
        });
    }
}
exports.RouteManager = RouteManager;
//# sourceMappingURL=RouteManager.js.map