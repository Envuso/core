"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageServiceProvider = void 0;
const tslib_1 = require("tslib");
const ServiceProvider_1 = require("../AppContainer/ServiceProvider");
const Storage_1 = require("./Storage");
class StorageServiceProvider extends ServiceProvider_1.ServiceProvider {
    register(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            app.container().register(Storage_1.Storage, {
                useFactory: () => {
                    return new Storage_1.Storage(config.get('storage'));
                }
            });
        });
    }
    boot(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.StorageServiceProvider = StorageServiceProvider;
//# sourceMappingURL=StorageServiceProvider.js.map