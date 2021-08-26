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
exports.DatabaseServiceProvider = void 0;
const mongodb_1 = require("mongodb");
const pluralize_1 = __importDefault(require("pluralize"));
const ServiceProvider_1 = require("../AppContainer/ServiceProvider");
const AppContainer_1 = require("../AppContainer");
const Common_1 = require("../Common");
const path_1 = __importDefault(require("path"));
const SeedManager_1 = require("./Seeder/SeedManager");
const RedisClientInstance_1 = require("./Redis/RedisClientInstance");
class DatabaseServiceProvider extends ServiceProvider_1.ServiceProvider {
    register(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoConfig = config.get('database.mongo');
            const client = new mongodb_1.MongoClient(mongoConfig.url, mongoConfig.clientOptions);
            const connection = yield client.connect();
            app.container().register(mongodb_1.MongoClient, { useValue: connection });
            app.container().register(SeedManager_1.SeedManager, { useValue: new SeedManager_1.SeedManager() });
            yield this.loadModels(config.get('paths.models'));
        });
    }
    boot(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initiate the connection to redis and prep the client for usage
            RedisClientInstance_1.RedisClientInstance.get();
        });
    }
    loadModels(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
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