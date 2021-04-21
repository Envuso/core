"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const tslib_1 = require("tslib");
const fastify_1 = tslib_1.__importDefault(require("fastify"));
const middie_1 = tslib_1.__importDefault(require("middie"));
const AppContainer_1 = require("../../AppContainer");
const Common_1 = require("../../Common");
const Routing_1 = require("../../Routing");
class Server {
    constructor() {
        /**
         * Allows the developer to implement their own error handling/formatting
         *
         * The framework package(that is cloned to create a new project) will implement
         * a base exception handler, by default the framework will use that class.
         * But... it can be over-ridden with a completely custom one.
         *
         * @private
         */
        this._customErrorHandler = null;
    }
    /**
     * Initialise fastify, add all routes to the application and apply any middlewares
     */
    initialise() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._server)
                throw new Error('Server has already been built');
            this._server = fastify_1.default(AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('server.fastifyOptions'));
            yield this._server.register(middie_1.default);
            this._server.addHook('preHandler', (request, response, done) => {
                (new Routing_1.RequestContext(request, response)).bind(done);
            });
            this._server.addHook('preHandler', (request, response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (request.isMultipart())
                    yield Routing_1.UploadedFile.addToRequest(request);
            }));
            this._server.addHook('onError', (request, reply, error, done) => {
                Common_1.Log.error(error.message);
                console.error(error);
                done();
            });
            this.registerPlugins();
            this.registerControllers();
            return this._server;
        });
    }
    /**
     * Register all controller routes inside fastify
     *
     * @private
     */
    registerControllers() {
        //		this._server.register((instance, opts, done) => {
        const controllers = Routing_1.ControllerManager.initiateControllers();
        for (let controller of controllers) {
            const routes = controller.routes;
            for (let route of routes) {
                const handler = route.getMiddlewareHandler();
                this._server.route({
                    method: route.getMethod(),
                    handler: route.getHandlerFactory(),
                    url: route.getPath(),
                    preHandler: function (req, res) {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            if (handler) {
                                const context = Routing_1.RequestContext.get();
                                yield handler(context);
                            }
                        });
                    },
                    errorHandler: (error, request, reply) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        yield this.handleException(error, request, reply);
                    })
                });
                Common_1.Log.info(`Route Loaded: ${controller.controller.constructor.name}(${route.getMethod()} ${route.getPath()})`);
            }
        }
        //			done();
        //		})
    }
    /**
     * This will register app Fastify Plugins from Config/App.ts > fastifyPlugins
     *
     * @private
     */
    registerPlugins() {
        const plugins = AppContainer_1.resolve(AppContainer_1.ConfigRepository)
            .get('server.fastifyPlugins');
        plugins.forEach(plugin => {
            this._server.register(plugin[0], plugin[1]);
        });
    }
    /**
     * Begin listening for connections
     */
    listen() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this._server.listen(3000);
            Common_1.Log.success('Server is running at http://127.0.0.1:3000');
        });
    }
    setErrorHandling(handler) {
        this._customErrorHandler = handler;
    }
    handleException(error, request, reply) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._customErrorHandler) {
                return reply.status(500).send({
                    message: error.message,
                    code: 500,
                });
            }
            const response = yield this._customErrorHandler(error, request, reply);
            response.send();
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map