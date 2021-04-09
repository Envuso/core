import { dotnotate } from "@zishone/dotnotate";
export class ConfigRepository {
    /**
     * Load all available Configuration
     *
     * We'll use dotnotate to allow us to access a value with a string
     * like "services.app", but then merge it with the original
     * so we can also access a base object like "services"
     *
     *
     * @param configDirectory
     * @private
     */
    async loadConfigFrom(configDirectory) {
        const conf = await import(configDirectory);
        this._config = { ...dotnotate(conf.Config), ...conf.Config };
    }
    /**
     * Get a Config value by key
     *
     * @param key
     * @param _default
     */
    get(key, _default = null) {
        return this._config[key] ?? _default;
    }
    /**
     * Set a Config on the repository
     *
     * @param key
     * @param value
     */
    set(key, value) {
        const constructedConfig = {};
        constructedConfig[key] = value;
        const configToSet = { ...dotnotate(constructedConfig), ...constructedConfig };
        this._config = { ...this._config, ...configToSet };
    }
    /**
     * Does a key exist in the Config?
     *
     * @param key
     */
    has(key) {
        return !!this._config[key];
    }
}
//# sourceMappingURL=ConfigRepository.js.map