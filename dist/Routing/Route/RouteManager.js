"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const tslib_1 = require("tslib");
const Common_1 = require("../../Common");
const RequestInjection_1 = require("./RequestInjection");
class RouteManager {
    /**
     * Reflect Metadata keys that we'll use for method parameter handling. We
     * basically iterate through these to see if they're applied to the method
     * and if they are, it will return a {@see MethodParameterDecorator} instance
     */
    static methodParamTypesForInjection() {
        return [
            Common_1.METADATA.REQUEST_METHOD_DTO,
            Common_1.METADATA.REQUEST_METHOD_FASTIFY_REQUEST,
            Common_1.METADATA.REQUEST_METHOD_ROUTE_PARAMETER,
            Common_1.METADATA.REQUEST_METHOD_QUERY_PARAMETER,
            Common_1.METADATA.REQUEST_METHOD_BODY,
            Common_1.METADATA.REQUEST_METHOD_HEADERS
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //TODO: Double check we actually need this, pretty sure that
            //We figured out last night that, this was basically useless
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
                    const methodMeta = RequestInjection_1.MethodParameterDecorator.getMethodMetadata(route.methodMeta.target[route.methodMeta.key], metadataKey);
                    if (!methodMeta) {
                        Common_1.Log.info('Param ' + route.methodMeta.key + ' doesnt have meta for injector: ' + metadataKey);
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