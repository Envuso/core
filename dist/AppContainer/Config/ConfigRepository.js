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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigRepository = void 0;
const lodash_get_1 = __importDefault(require("lodash.get"));
const lodash_set_1 = __importDefault(require("lodash.set"));
const lodash_has_1 = __importDefault(require("lodash.has"));
class ConfigRepository {
    /**
     * Load all available Configuration
     *
     * We'll pass the config in here via the object that is registered in the apps boot
     * process. Previously it tried to import the file from the path path specified,
     * this didn't work when compiled because it was /src/ not /dist/
     *
     * @private
     */
    loadConfigFrom(config) {
        return __awaiter(this, void 0, void 0, function* () {
            //		const conf = await import(configDirectory);
            this._config = config;
        });
    }
    /**
     * Get a Config value by key
     *
     * @param key
     * @param _default
     */
    get(key, _default = null) {
        return lodash_get_1.default(this._config, key, _default);
        //return this._config[key] as T ?? _default;
    }
    /**
     * Set a Config on the repository
     *
     * @param key
     * @param value
     */
    set(key, value) {
        lodash_set_1.default(this._config, key, value);
        //		const constructedConfig = {};
        //
        //		if(key.includes('.')){
        //			const keys = key.split('.');
        //
        //			let currentConfig = this._config;
        //			for (let key of keys) {
        //				if(!currentConfig[key]){
        //					constructedConfig[key] = {};
        //					currentConfig[key] = {};
        //				}
        //
        //
        //			}
        //		}
        //
        //		constructedConfig[key] = value;
        //
        //		const configToSet = {...dotnotate(constructedConfig), ...constructedConfig};
        //
        //		this._config = {...this._config, ...configToSet};
    }
    /**
     * If the target is an array, then we'll push it to the array
     *
     * @param key
     * @param value
     */
    put(key, value) {
        const current = this.get(key);
        if (!current) {
            this.set(key, [value]);
            return;
        }
        if (!(Array.isArray(current))) {
            throw new Error('ConfigRepository: Target ' + key + ' is not an array');
        }
        current.push(value);
        this.set(key, current);
    }
    /**
     * Does a key exist in the Config?
     *
     * @param key
     */
    has(key) {
        return lodash_has_1.default(this._config, key);
        //		return !!this._config[key];
    }
    reset() {
        this._config = {};
    }
}
exports.ConfigRepository = ConfigRepository;
//# sourceMappingURL=ConfigRepository.js.map