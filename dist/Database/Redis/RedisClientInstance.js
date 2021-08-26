"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClientInstance = void 0;
const redis_1 = __importDefault(require("redis"));
const AppContainer_1 = require("../../AppContainer");
const Common_1 = require("../../Common");
let instance = null;
class RedisClientInstance {
    constructor() {
        const defaultConfiguration = {
            enabled: false,
            prefix: 'envuso-',
            db: 'default',
            host: '127.0.0.1',
            port: 6379,
        };
        this._config = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('database.redis', defaultConfiguration);
        this.setup();
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
        this._client.on("error", (error) => {
            Common_1.Log.exception('Redis Error: ', error);
        });
    }
    static get() {
        if (instance)
            return instance;
        instance = new this();
        return instance;
    }
    static isEnabled() {
        return this.get()._config.enabled;
    }
    static client() {
        return this.get()._client;
    }
}
exports.RedisClientInstance = RedisClientInstance;
//# sourceMappingURL=RedisClientInstance.js.map