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
exports.Route = void 0;
const app_1 = require("@envuso/app");
const src_1 = require("@envuso/app/dist/src");
const common_1 = require("@envuso/common");
const Log_1 = require("@envuso/common/dist/src/Logger/Log");
const class_transformer_1 = require("class-transformer");
const http_status_codes_1 = require("http-status-codes");
const RequestContext_1 = require("../Context/RequestContext");
const Response_1 = require("../Context/Response/Response");
const Middleware_1 = require("../Middleware/Middleware");
const RouteManager_1 = require("./RouteManager");
class Route {
    constructor(controllerMeta, methodMeta) {
        this.controllerMeta = controllerMeta;
        this.methodMeta = methodMeta;
    }
    /**
     * Returns all the fastify route arguments needed to
     * bind this route to the fastify instance
     */
    getFastifyOptions() {
        return [
            this.getRoutePath(),
            this.getMiddlewareFactory(),
            this.getHandlerFactory(),
        ];
    }
    /**
     * Return the controller path & method path so that it can be built up
     */
    pathParts() {
        return [
            this.controllerMeta.controller.path,
            this.methodMeta.path
        ];
    }
    /**
     * Parse the controller & method route, allows us to define routes without a leading /
     */
    getRoutePath() {
        const pathParts = this.pathParts();
        for (let path in pathParts) {
            pathParts[path] = pathParts[path].replace('/', '');
        }
        let path = pathParts.join('/');
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        return path;
    }
    /**
     * Handle the request to the controller method
     *
     * @private
     */
    getHandlerFactory() {
        return (request, response) => __awaiter(this, void 0, void 0, function* () {
            //			try {
            const parameters = yield RouteManager_1.RouteManager.parametersForRoute(request, response, this);
            let httpContext = null;
            if (request)
                httpContext = Reflect.getMetadata(common_1.METADATA.HTTP_CONTEXT, request);
            const controller = src_1.App.getInstance().resolve(this.controllerMeta.controller.target);
            const routeMethod = controller[this.methodMeta.key];
            const routeResponse = yield routeMethod(...parameters);
            if (response === null || response === void 0 ? void 0 : response.sent) {
                console.warn('Response is already sent... something is offf.');
                return;
            }
            return this.getResponseResult(routeResponse);
            //			} catch (error) {
            /*
            @TODO
            NOTE FOR SELF...
            We could just remove the try catch and let the implementing code catch the errors...
            This means the core or scaffold could try catch the response handling side
            and then throw the error into the exception handler to output a response...

            Either this or we create some kind of service provider to handle this logic
            which can be extended
             */
            //				if (App.getInstance().container().isRegistered('ExceptionHandler')) {
            //
            //				}
            //				console.error(error);
            //			}
        });
    }
    /**
     * Get all parameter types for this method
     *
     * We can then begin to resolve all of the parameter data.
     */
    getMethodParameterTypes() {
        const paramsTypes = Reflect.getMetadata('design:paramtypes', this.methodMeta.target, this.methodMeta.key);
        if (!paramsTypes) {
            return [];
        }
        return paramsTypes;
    }
    /**
     * Get the result of the response from the controller action.
     *
     * If the controller responded with undefined/null, we'll send a no content response
     * If there was an object returned directly from the controller, we'll create a new response and send it.
     *
     * Otherwise, we'll send the response of the {@see RequestContext}
     *
     * @param controllerResponse
     * @private
     */
    getResponseResult(controllerResponse) {
        const response = RequestContext_1.RequestContext.response();
        if (controllerResponse === undefined || controllerResponse === null) {
            return response.setResponse(null, http_status_codes_1.StatusCodes.NO_CONTENT).send();
        }
        const responseSerializationConfig = src_1.App.getInstance()
            .resolve(app_1.ConfigRepository)
            .get('http.responseSerialization', {
            enableCircularCheck: true,
            excludePrefixes: ['_'],
            strategy: 'exposeAll'
        });
        if (!(controllerResponse instanceof Response_1.Response)) {
            return response.setResponse(class_transformer_1.classToPlain(controllerResponse, responseSerializationConfig), http_status_codes_1.StatusCodes.ACCEPTED).send();
        }
        controllerResponse.data = class_transformer_1.serialize(controllerResponse.data, responseSerializationConfig);
        return controllerResponse.send();
    }
    /**
     * Load the middleware for this route and return it as a fastify pre-handler
     *
     * @private
     */
    getMiddlewareFactory() {
        const controllerMiddlewareMeta = Middleware_1.Middleware.getMetadata(this.controllerMeta.controller.target.constructor);
        const methodMiddlewareMeta = Middleware_1.Middleware.getMetadata(this.methodMeta.target[this.methodMeta.key]);
        const middlewares = [
            ...((controllerMiddlewareMeta === null || controllerMiddlewareMeta === void 0 ? void 0 : controllerMiddlewareMeta.middlewares) || []),
            ...((methodMiddlewareMeta === null || methodMiddlewareMeta === void 0 ? void 0 : methodMiddlewareMeta.middlewares) || []),
        ];
        middlewares.forEach(mw => {
            Log_1.Log.info(mw.constructor.name + ' was loaded for ' + this.getRoutePath());
        });
        return {
            preHandler: (request, response) => __awaiter(this, void 0, void 0, function* () {
                for (const middleware of middlewares) {
                    try {
                        yield middleware.handler(request, response);
                    }
                    catch (exception) {
                        //						return ExceptionHandler.transform(exception, response);
                        console.error(exception);
                    }
                }
            })
        };
    }
}
exports.Route = Route;
//# sourceMappingURL=Route.js.map