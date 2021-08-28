"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClientInstance = void 0;
const redis_1 = __importDefault(require("redis"));
const Common_1 = require("../../Common");
const Redis_1 = require("./Redis");
let instance = null;
class RedisClientInstance {
    constructor(config) {
        if (instance)
            return;
        const defaultConfiguration = {
            enabled: false,
            prefix: 'envuso-',
            db: 'default',
            host: '127.0.0.1',
            port: 6379,
        };
        this._config = config !== null && config !== void 0 ? config : defaultConfiguration;
        this.setup();
        instance = this;
    }
    /**
     * Setup and prepare the redis connection
     */
    setup() {
        if (!this._config.enabled) {
            this._client = null;
            return;
        }
        this._client = redis_1.default.createClient(this._config);
        Common_1.Log.info('Redis is: ' + (this._client.connected ? 'Connected' : 'Disconnected'));
        this._client.on("error", (error) => {
            Common_1.Log.exception('Redis Error: ', error);
        });
        new Redis_1.Redis(this._client);
    }
    /**
     * Get the instance of the class
     *
     * @returns {RedisClientInstance}
     */
    static get() {
        return instance;
    }
    /**
     * Is redis enabled/disabled in the configuration?
     *
     * @returns {boolean}
     */
    static isEnabled() {
        return this.get()._config.enabled;
    }
    /**
     * Get the underlying redis client instance
     *
     * @returns {RedisClient}
     */
    static client() {
        return this.get()._client;
    }
}
exports.RedisClientInstance = RedisClientInstance;
//# sourceMappingURL=RedisClientInstance.js.map