"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const tslib_1 = require("tslib");
const node_cache_redis_1 = require("node-cache-redis");
class Cache {
    get(key, defaultValue = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const value = yield node_cache_redis_1.get(key);
            return value !== null && value !== void 0 ? value : defaultValue;
        });
    }
    put(key, value, ttl) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield node_cache_redis_1.set(key, value, ttl);
        });
    }
    remove(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield node_cache_redis_1.del([key]);
        });
    }
    has(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return !!(yield this.get(key, undefined));
        });
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map