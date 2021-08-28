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
const Common_1 = require("../../Common");
const RedisClientInstance_1 = require("./RedisClientInstance");
let instance = null;
class Redis {
    constructor(client) {
        if (instance) {
            return instance;
        }
        this.client = client;
        this.asyncOperations = {
            set: util_1.promisify(this.client.set).bind(this.client),
            get: util_1.promisify(this.client.get).bind(this.client),
            del: util_1.promisify(this.client.del).bind(this.client),
            exists: util_1.promisify(this.client.exists).bind(this.client),
        };
        instance = this;
    }
    static getInstance() {
        return instance;
    }
    /**
     * Get the underlying redis client
     *
     * @returns {RedisClient}
     */
    static client() {
        return this.getInstance().client;
    }
    /**
     * Set a value using promises rather than callbacks
     *
     * We JSON.stringify the value so that hopefully you
     * will get the same type returned.
     *
     * @param {string} key
     * @param {any} value
     * @param {DateTime|undefined} ttl | A datetime instance of a date in the future when this key should expire.
     *
     * @returns {Promise<boolean>}
     */
    static put(key, value, ttl) {
        return this.getInstance().put(key, value, ttl);
    }
    /**
     * Set a value using promises rather than callbacks
     *
     * We JSON.stringify the value so that hopefully you
     * will get the same type returned.
     *
     * @param {string} key
     * @param {any} value
     * @param {DateTime|undefined} ttl | A datetime instance of a date in the future when this key should expire.
     *
     * @returns {Promise<boolean>}
     */
    put(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RedisClientInstance_1.RedisClientInstance.isEnabled()) {
                return;
            }
            const redisValue = JSON.stringify({ value: value });
            if (ttl !== undefined) {
                return (yield this.asyncOperations.set(key, redisValue, 'EX', Common_1.DateTime.diffInSeconds(ttl))) === 'OK';
            }
            return (yield this.asyncOperations.set(key, redisValue)) === 'OK';
        });
    }
    /**
     * Get a value from the redis store using promises
     *
     * You can specify a default value, so that if your value doesn't exist
     * it can fallback to the value you specified.
     *
     * @param {string} key
     * @param {null} _default
     *
     * @returns {Promise<T>}
     */
    static get(key, _default = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getInstance().get(key, _default);
        });
    }
    /**
     * Get a value from the redis store using promises
     *
     * You can specify a default value, so that if your value doesn't exist
     * it can fallback to the value you specified.
     *
     * @param {string} key
     * @param {null} _default
     *
     * @returns {Promise<T>}
     */
    get(key, _default = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RedisClientInstance_1.RedisClientInstance.isEnabled()) {
                return null;
            }
            let value = yield this.asyncOperations.get(key);
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
     * @returns {Promise<boolean>}
     */
    static remove(key) {
        return this.getInstance().remove(key);
    }
    /**
     * Delete an entry from redis by it's key
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RedisClientInstance_1.RedisClientInstance.isEnabled()) {
                return;
            }
            return (yield this.asyncOperations.del(key)) === 1;
        });
    }
    /**
     * Check if x key is stored in redis.
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    static has(key) {
        return this.getInstance().has(key);
    }
    /**
     * Check if x key is stored in redis.
     *
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    has(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RedisClientInstance_1.RedisClientInstance.isEnabled()) {
                return;
            }
            return (yield this.asyncOperations.exists(key)) === 1;
        });
    }
}
exports.Redis = Redis;
//# sourceMappingURL=Redis.js.map