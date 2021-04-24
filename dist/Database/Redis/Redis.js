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
exports.Redis = void 0;
const util_1 = require("util");
const RedisClientInstance_1 = require("./RedisClientInstance");
class Redis {
    /**
     * Get the underlying redis client
     *
     * @returns {RedisClient}
     */
    static client() {
        return RedisClientInstance_1.RedisClientInstance.client();
    }
    /**
     * Set a value using promises rather than callbacks
     *
     * We JSON.stringify the value so that hopefully you
     * will get the same type returned.
     *
     * @param key
     * @param value
     * @returns {any}
     */
    static put(key, value) {
        const setAsync = util_1.promisify(RedisClientInstance_1.RedisClientInstance.client().set).bind(RedisClientInstance_1.RedisClientInstance.client());
        return setAsync(key, JSON.stringify({ value: value }));
    }
    /**
     * Get a value from the redis store using promises
     *
     * You can specify a default value, so that if your value doesn't exist
     * it can fallback to the value you specified.
     *
     * @param key
     * @param {null} _default
     * @returns {Promise<T>}
     */
    static get(key, _default = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const getAsync = util_1.promisify(RedisClientInstance_1.RedisClientInstance.client().get).bind(RedisClientInstance_1.RedisClientInstance.client());
            let value = yield getAsync(key);
            if (value === undefined || value === null) {
                return _default;
            }
            value = JSON.parse(value);
            return value.value;
        });
    }
    /**
     * Delete an entry from redis by it's key
     *
     * @param {string} key
     * @returns {any}
     */
    static remove(key) {
        const delAsync = util_1.promisify(RedisClientInstance_1.RedisClientInstance.client().del).bind(RedisClientInstance_1.RedisClientInstance.client());
        return delAsync(key);
    }
}
exports.Redis = Redis;
//# sourceMappingURL=Redis.js.map