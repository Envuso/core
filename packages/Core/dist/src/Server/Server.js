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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const app_1 = require("@envuso/app");
const common_1 = require("@envuso/common");
const routing_1 = require("@envuso/routing");
const fastify_1 = __importDefault(require("fastify"));
const middie_1 = __importDefault(require("middie"));
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
        return __awaiter(this, void 0, void 0, function* () {
            if (this._server)
                throw new Error('Server has already been built');
            this._server = fastify_1.default(app_1.resolve(app_1.ConfigRepository).get('server.fastifyOptions'));
            yield this._server.register(middie_1.default);
            this._server.addHook('preHandler', (request, response, done) => {
                (new routing_1.RequestContext(request, response)).bind(done);
            });
            this._server.addHook('preHandler', (request, response) => __awaiter(this, void 0, void 0, function* () {
                if (request.isMultipart())
                    yield routing_1.UploadedFile.addToRequest(request);
            }));
            this._server.addHook('onError', (request, reply, error, done) => {
                common_1.Log.error(error.message);
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
        const controllers = routing_1.ControllerManager.initiateControllers();
        for (let controller of controllers) {
            const routes = controller.routes;
            for (let route of routes) {
                this._server.route({
                    method: route.getMethod(),
                    handler: route.getHandlerFactory(),
                    url: route.getPath(),
                    preHandler: route.getHandlerFactory(),
                    errorHandler: (error, request, reply) => __awaiter(this, void 0, void 0, function* () {
                        yield this.handleException(error, request, reply);
                    })
                });
                common_1.Log.info(`Route Loaded: ${controller.constructor.name}(${route.getMethod()} ${route.getPath()})`);
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
        const plugins = app_1.resolve(app_1.ConfigRepository)
            .get('server.fastifyPlugins');
        plugins.forEach(plugin => {
            this._server.register(plugin[0], plugin[1]);
        });
    }
    /**
     * Begin listening for connections
     */
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._server.listen(3000);
            common_1.Log.success('Server is running at http://127.0.0.1:3000');
        });
    }
    setErrorHandling(handler) {
        this._customErrorHandler = handler;
    }
    handleException(error, request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
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