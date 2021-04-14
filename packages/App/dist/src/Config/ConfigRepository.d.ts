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
     * We'll pass the config in here via the object that is registered in the apps boot
     * process. Previously it tried to import the file from the path path specified,
     * this didn't work when compiled because it was /src/ not /dist/
     *
     * @private
     */
    loadConfigFrom(config: object): Promise<void>;
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
     * If the target is an array, then we'll push it to the array
     *
     * @param key
     * @param value
     */
    put(key: string, value: any): void;
    /**
     * Does a key exist in the Config?
     *
     * @param key
     */
    has(key: string): boolean;
    reset(): void;
}
