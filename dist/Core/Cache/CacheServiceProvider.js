"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheServiceProvider = void 0;
const tslib_1 = require("tslib");
const node_cache_redis_1 = require("node-cache-redis");
const AppContainer_1 = require("../../AppContainer");
class CacheServiceProvider extends AppContainer_1.ServiceProvider {
    register(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const defaultConfiguration = {
                name: "app_cache",
                redisOptions: {
                    host: '127.0.0.1',
                    port: 9379,
                }
            };
            node_cache_redis_1.init(config.get('database.redis', defaultConfiguration));
        });
    }
    boot() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () { });
    }
}
exports.CacheServiceProvider = CacheServiceProvider;
//# sourceMappingURL=CacheServiceProvider.js.map