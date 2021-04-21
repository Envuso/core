"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseServiceProvider = void 0;
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const pluralize_1 = tslib_1.__importDefault(require("pluralize"));
const AppContainer_1 = require("../AppContainer");
const Common_1 = require("../Common");
const path_1 = tslib_1.__importDefault(require("path"));
class DatabaseServiceProvider extends AppContainer_1.ServiceProvider {
    register(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const mongoConfig = config.get('database.mongo');
            const client = new mongodb_1.MongoClient(mongoConfig.url, mongoConfig.clientOptions);
            const connection = yield client.connect();
            app.container().register(mongodb_1.MongoClient, { useValue: connection });
            yield this.loadModels(config.get('paths.models'));
        });
    }
    boot(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    loadModels(modulePath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const modules = yield Common_1.FileLoader.importModulesFrom(path_1.default.join(modulePath, '**', '*.ts'));
            const client = AppContainer_1.resolve(mongodb_1.MongoClient);
            const dbName = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('database.mongo.name');
            for (let module of modules) {
                const collection = client.db(dbName).collection(pluralize_1.default(module.name.toLowerCase()));
                AppContainer_1.app().container().register(module.name + 'Model', {
                    useValue: collection
                });
            }
        });
    }
}
exports.DatabaseServiceProvider = DatabaseServiceProvider;
//# sourceMappingURL=DatabaseServiceProvider.js.map