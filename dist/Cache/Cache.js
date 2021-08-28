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
const Database_1 = require("../Database");
class Cache {
    /**
     * Get a value from the redis cache
     *
     * @param {string} key
     * @param _default
     * @returns {Promise<T>}
     */
    static get(key, _default = null) {
        return Database_1.Redis.get(`redis-cache.${key}`, _default);
    }
    static put(key, value, ttl = undefined) {
        return Database_1.Redis.put(`redis-cache.${key}`, value, ttl);
    }
    /**
     * Remove an item from the redis cache
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    static remove(key) {
        return Database_1.Redis.remove(`redis-cache.${key}`);
    }
    /**
     * Check if an item exists in the redis cache
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    static has(key) {
        return Database_1.Redis.has(`redis-cache.${key}`);
    }
    /**
     * Allows us to handle all of the checking around caching a value/getting a value.
     * If our key exists already, it will be returned
     * If it doesn't, our callback will be called, the value of the callback will
     * be inserted into the cache, then the value returned.
     *
     * It allows us to do simpler caching;
     * const users = Cache.remember('users', async () => await User.get(), DateTime.now().addHours(2));
     *
     * In this case, if 'users' key doesn't exist in the cache, we'll get all our users from
     * the database, insert them to the cache, then return the value
     * However... if they do exist in the cache, it will just return us the users
     *
     * @param {string} key
     * @param {() => Promise<T>} callback
     * @param {DateTime|undefined} ttl
     * @returns {Promise<T>}
     */
    static remember(key, callback, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.has(key)) {
                return yield this.get(key);
            }
            yield this.put(key, yield callback(), ttl);
            return yield this.get(key);
        });
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map