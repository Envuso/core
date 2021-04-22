"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const http_status_codes_1 = require("http-status-codes");
const AppContainer_1 = require("../../AppContainer");
const Common_1 = require("../../Common");
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
     * Get the HTTP verb used for this fastify route
     */
    getMethod() {
        return this.methodMeta.method;
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
    getPath() {
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
        return (request, response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const parameters = yield RouteManager_1.RouteManager.parametersForRoute(request, response, this);
            let httpContext = null;
            if (request)
                httpContext = Reflect.getMetadata(Common_1.METADATA.HTTP_CONTEXT, request);
            let controller;
            try {
                controller = AppContainer_1.App.getInstance().resolve(this.controllerMeta.controller.target);
            }
            catch (error) {
                console.error(error);
            }
            const routeMethod = controller[this.methodMeta.key].bind(controller);
            const routeResponse = yield routeMethod(...parameters);
            if (response === null || response === void 0 ? void 0 : response.sent) {
                console.warn('Response is already sent... something is offf.');
                return;
            }
            return Route.getResponseResult(routeResponse);
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
    static getResponseResult(controllerResponse) {
        const response = RequestContext_1.RequestContext.response();
        if (controllerResponse === undefined || controllerResponse === null) {
            return response.setResponse(null, http_status_codes_1.StatusCodes.NO_CONTENT).send();
        }
        const responseSerializationConfig = AppContainer_1.App.getInstance()
            .resolve(AppContainer_1.ConfigRepository)
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
    getMiddlewareHandler() {
        const controllerMiddlewareMeta = Middleware_1.Middleware.getMetadata(this.controllerMeta.controller.target);
        const methodMiddlewareMeta = Middleware_1.Middleware.getMetadata(this.methodMeta.target[this.methodMeta.key]);
        const middlewares = [
            ...((controllerMiddlewareMeta === null || controllerMiddlewareMeta === void 0 ? void 0 : controllerMiddlewareMeta.middlewares) || []),
            ...((methodMiddlewareMeta === null || methodMiddlewareMeta === void 0 ? void 0 : methodMiddlewareMeta.middlewares) || []),
        ];
        middlewares.forEach(mw => {
            Common_1.Log.info(mw.constructor.name + ' was loaded for ' + this.getPath());
        });
        return (context) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (const middleware of middlewares) {
                yield middleware.handler(context);
            }
        });
    }
}
exports.Route = Route;
//# sourceMappingURL=Route.js.map