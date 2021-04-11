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
exports.Envuso = void 0;
const app_1 = require("@envuso/app");
const common_1 = require("@envuso/common");
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
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            yield app_1.App.bootInstance();
            yield app_1.App.getInstance().loadServiceProviders();
            this._app = app_1.App.getInstance();
            common_1.Log.success('Envuso is ready to go? PogU');
            this._server = app_1.resolve(Server_1.Server);
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
        return __awaiter(this, void 0, void 0, function* () {
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