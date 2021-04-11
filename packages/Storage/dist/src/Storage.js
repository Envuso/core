"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const app_1 = require("@envuso/app");
const StorageProviderContract_1 = require("./StorageProviderContract");
class Storage {
    constructor(storageConfig) {
        this._config = storageConfig;
        this._provider = new storageConfig.defaultProvider(storageConfig);
        if (!(this._provider instanceof StorageProviderContract_1.StorageProviderContract)) {
            throw new Error('Your storage provider is not an instance of StorageProviderContract');
        }
    }
    /**
     * Use storage with a different provider
     *
     * Allows us to set our default as S3 for example, then use disk for other things.
     *
     * @param provider
     */
    static provider(provider) {
        const storageConfig = app_1.resolve(app_1.ConfigRepository).get('storage');
        return new provider(storageConfig);
    }
    /**
     * Access the storage provider adapter statically
     * This will resolve a new instance of the provider from the container
     */
    static getAdapter() {
        return app_1.resolve(Storage).getProvider();
    }
    /**
     * Get the files from the target directory
     *
     * @param directory
     */
    static files(directory) {
        return this.getAdapter().files(directory);
    }
    /**
     * Get all directories in the directory
     *
     * @param directory
     */
    static directories(directory) {
        return this.getAdapter().directories(directory);
    }
    /**
     * Create a new directory
     *
     * @param directory
     */
    static makeDirectory(directory) {
        return this.getAdapter().makeDirectory(directory);
    }
    /**
     * Delete a directory
     *
     * @param directory
     */
    static deleteDirectory(directory) {
        return this.getAdapter().deleteDirectory(directory);
    }
    /**
     * Check if a file exists at the location
     *
     * @param key
     */
    static fileExists(key) {
        return this.getAdapter().fileExists(key);
    }
    /**
     * Get the contents of a file
     *
     * @param location
     */
    static get(location) {
        return this.getAdapter().get(location);
    }
    /**
     * Create a new file and put the contents
     *
     * @param location
     * @param file
     */
    static put(location, file) {
        return this.getAdapter().put(location, file);
    }
    /**
     * Delete a file
     *
     * @param location
     */
    static remove(location) {
        return this.getAdapter().remove(location);
    }
    /**
     * Get the url for the file
     *
     * @param location
     */
    static url(location) {
        return this.getAdapter().url(location);
    }
    /**
     * Get a temporary url for the file
     * (only works if it's an S3 based provider)
     *
     * @param location
     * @param expiresInSeconds
     */
    static temporaryUrl(location, expiresInSeconds) {
        return this.getAdapter().temporaryUrl(location, expiresInSeconds);
    }
    /**
     * Return the adapter set on this instance
     *
     * @private
     */
    getProvider() {
        return this._provider;
    }
}
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map