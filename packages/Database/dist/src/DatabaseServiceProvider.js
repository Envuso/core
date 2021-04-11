"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const app_1 = require("@envuso/app");
const common_1 = require("@envuso/common");
const mongodb_1 = require("mongodb");
const pluralize_1 = __importDefault(require("pluralize"));
const path_1 = __importDefault(require("path"));
class DatabaseServiceProvider extends app_1.ServiceProvider {
    register(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoConfig = config.get('database.mongo');
            const client = new mongodb_1.MongoClient(mongoConfig.url, mongoConfig.clientOptions);
            const connection = yield client.connect();
            app.container().register(mongodb_1.MongoClient, { useValue: connection });
            yield this.loadModels(config.get('paths.models'));
        });
    }
    boot(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    loadModels(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = common_1.loadModulesFromPath(path_1.default.join(modulePath, '**', '*.ts'));
            const client = app_1.resolve(mongodb_1.MongoClient);
            const dbName = app_1.resolve(app_1.ConfigRepository).get('database.mongo.name');
            for (let path of paths) {
                const module = yield Promise.resolve().then(() => __importStar(require(path)));
                const { instance, name } = common_1.classAndNameFromModule(module);
                const collection = client.db(dbName).collection(pluralize_1.default(name.toLowerCase()));
                app_1.app().container().register(instance, {
                    useValue: collection
                });
            }
        });
    }
}
exports.DatabaseServiceProvider = DatabaseServiceProvider;
//# sourceMappingURL=DatabaseServiceProvider.js.map