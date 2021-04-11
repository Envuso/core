/// <reference types="node" />
import { StorageConfig } from "../Config/Storage";
import { StorageProviderContract, StoragePutOptions } from "./StorageProviderContract";
export declare class Storage {
    private _config;
    private _provider;
    constructor(storageConfig: StorageConfig);
    /**
     * Use storage with a different provider
     *
     * Allows us to set our default as S3 for example, then use disk for other things.
     *
     * @param provider
     */
    static provider(provider: new (storageConfig: StorageConfig) => StorageProviderContract): StorageProviderContract;
    /**
     * Access the storage provider adapter statically
     * This will resolve a new instance of the provider from the container
     */
    static getAdapter<T extends StorageProviderContract>(): T;
    /**
     * Get the files from the target directory
     *
     * @param directory
     */
    static files(directory: string): any;
    /**
     * Get all directories in the directory
     *
     * @param directory
     */
    static directories(directory: string): any;
    /**
     * Create a new directory
     *
     * @param directory
     */
    static makeDirectory(directory: string): any;
    /**
     * Delete a directory
     *
     * @param directory
     */
    static deleteDirectory(directory: string): any;
    /**
     * Check if a file exists at the location
     *
     * @param key
     */
    static fileExists(key: string): any;
    /**
     * Get the contents of a file
     *
     * @param location
     */
    static get(location: string): any;
    /**
     * Create a new file and put the contents
     *
     * @param location
     * @param file
     */
    static put(location: string, file: StoragePutOptions): any;
    /**
     * Delete a file
     *
     * @param location
     */
    static remove(location: string): any;
    /**
     * Get the url for the file
     *
     * @param location
     */
    static url(location: string): any;
    /**
     * Get a temporary url for the file
     * (only works if it's an S3 based provider)
     *
     * @param location
     * @param expiresInSeconds
     */
    static temporaryUrl(location: string, expiresInSeconds: number): any;
    /**
     * When we have a file upload, we will pass the original file name
     * to this method, along with it's stream. This method will store
     * it in the storage's temp file directory and return it's name.
     *
     * @param fileName
     * @param stream
     */
    static saveTemporaryFile(fileName: string, stream: NodeJS.ReadStream): Promise<string>;
    /**
     * Return the adapter set on this instance
     *
     * @private
     */
    private getProvider;
}
