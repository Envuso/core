export declare class ConfigRepository {
    /**
     * All of the Config loaded into the repository
     *
     * @private
     */
    private _config;
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
    loadConfigFrom(configDirectory: string): Promise<void>;
    /**
     * Get a Config value by key
     *
     * @param key
     * @param _default
     */
    get<T>(key: string, _default?: any): T;
    /**
     * Set a Config on the repository
     *
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Does a key exist in the Config?
     *
     * @param key
     */
    has(key: string): boolean;
}
