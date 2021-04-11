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
exports.Cache = void 0;
const node_cache_redis_1 = require("node-cache-redis");
class Cache {
    get(key, defaultValue = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield node_cache_redis_1.get(key);
            return value !== null && value !== void 0 ? value : defaultValue;
        });
    }
    put(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield node_cache_redis_1.set(key, value, ttl);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield node_cache_redis_1.del([key]);
        });
    }
    has(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.get(key, undefined));
        });
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map