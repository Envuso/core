"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerServiceProvider = void 0;
const tslib_1 = require("tslib");
const AppContainer_1 = require("../../AppContainer");
const Server_1 = require("./Server");
class ServerServiceProvider extends AppContainer_1.ServiceProvider {
    register(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            app.container().registerSingleton(Server_1.Server);
        });
    }
    boot(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.ServerServiceProvider = ServerServiceProvider;
//# sourceMappingURL=ServerServiceProvider.js.map