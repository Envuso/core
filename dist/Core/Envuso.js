"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envuso = void 0;
const tslib_1 = require("tslib");
const AppContainer_1 = require("../AppContainer");
const Common_1 = require("../Common");
const Server_1 = require("./Server/Server");
class Envuso {
    constructor() {
        this._app = null;
        this._server = null;
    }
    /**
     * Boot the core App instance, bind any service
     * providers to the container and such.
     */
    prepare(config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield AppContainer_1.App.bootInstance({ config: config });
            yield AppContainer_1.App.getInstance().loadServiceProviders();
            this._app = AppContainer_1.App.getInstance();
            Common_1.Log.success('Envuso is ready to go? PogU');
            this._server = AppContainer_1.resolve(Server_1.Server);
            yield this.serve();
        });
    }
    /**
     * Load a custom exception handler for handling errors from requests
     * and returning a formatted response to your liking.
     *
     * @param handler
     */
    addExceptionHandler(handler) {
        this._server.setErrorHandling(handler);
    }
    /**
     * This will initialise all of the server
     * Bind your custom exception handler and begin listening for connections.
     */
    serve() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this._server.initialise();
            //		this.addExceptionHandler(async (exception, request, reply) => {
            //			return response().setResponse({
            //				message : 'Something broken af yo',
            //				err     : exception.message
            //			}, StatusCodes.BAD_REQUEST);
            //		});
            yield this._server.listen();
        });
    }
}
exports.Envuso = Envuso;
//# sourceMappingURL=Envuso.js.map