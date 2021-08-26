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
const mongodb_1 = require("mongodb");
const Common_1 = require("../../Common");
const Database_1 = require("../../Database");
const InvalidObjectIdUsed_1 = require("../../Database/Exceptions/InvalidObjectIdUsed");
const ModelNotFoundException_1 = require("../../Database/Exceptions/ModelNotFoundException");
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
            Common_1.METADATA.REQUEST_METHOD_HEADERS,
            Common_1.METADATA.REQUEST_AUTHENTICATED_USER,
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
     * @param context
     */
    static parametersForRoute(request, response, route, context) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //TODO: Double check we actually need this, pretty sure that
            //We figured out last night that, this was basically useless
            // const parameters = route.getMethodParameterTypes();
            //
            // if (!parameters.length) {
            // 	return [];
            // }
            const parameterArgs = [];
            for (let index in route.methodMeta.parameters) {
                const parameter = route.methodMeta.parameters[index];
                let boundParameter = false;
                for (let metadataKey of this.methodParamTypesForInjection()) {
                    const methodMeta = RequestInjection_1.MethodParameterDecorator.getMethodMetadata(route.methodMeta.target[route.methodMeta.key], metadataKey);
                    if (!methodMeta) {
                        //					Log.info('Param ' + route.methodMeta.key + ' doesnt have meta for injector: ' + metadataKey);
                        continue;
                    }
                    const canBind = methodMeta.canBind(route.methodMeta.target[route.methodMeta.key], parameter.type, Number(index));
                    if (canBind) {
                        parameterArgs.push(yield methodMeta.bind(request, response));
                        boundParameter = true;
                        break;
                    }
                }
                // Route model binding was conflicting with @user decorator... so
                // When we've handled a decorator for this parameter, we'll set bound
                // to true. This way, we can then fall-back to attempting route model binding.
                if (boundParameter) {
                    continue;
                }
                if (parameter.type.prototype instanceof Database_1.Model) {
                    const modelInstance = parameter.type;
                    const identifier = request.params[parameter.name];
                    if (!mongodb_1.ObjectId.isValid(identifier)) {
                        throw new InvalidObjectIdUsed_1.InvalidObjectIdUsed(modelInstance.name);
                    }
                    const model = (_a = yield modelInstance.find(identifier)) !== null && _a !== void 0 ? _a : null;
                    if (model === null) {
                        throw new ModelNotFoundException_1.ModelNotFoundException(modelInstance.name);
                    }
                    parameterArgs.push(model);
                }
            }
            return parameterArgs;
        });
    }
}
exports.RouteManager = RouteManager;
//# sourceMappingURL=RouteManager.js.map