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
exports.CacheServiceProvider = void 0;
const node_cache_redis_1 = require("node-cache-redis");
const AppContainer_1 = require("../AppContainer");
class CacheServiceProvider extends AppContainer_1.ServiceProvider {
    register(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultConfiguration = {
                prefix: "envuso-app-cache",
                host: '127.0.0.1',
                port: 9379,
            };
            node_cache_redis_1.init(config.get('database.redis', defaultConfiguration));
        });
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.CacheServiceProvider = CacheServiceProvider;
//# sourceMappingURL=CacheServiceProvider.js.map