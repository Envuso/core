/// <reference types="node" />
import { DisksList, DriverTypes, StorageConfiguration } from "../Config/Storage";
import { StorageProviderContract, StoragePutOptions, UploadedFileInformation } from "./StorageProviderContract";
export declare class Storage {
    private _config;
    private _provider;
    private _disk;
    constructor(storageConfig: StorageConfiguration);
    /**
     * Get an instance of x storage provider that is using x disk configuration
     * This allows us to map multiple local/remote locations/credentials to use
     * and switch between on the fly when it's needed.
     *
     * @param {string} disk
     * @returns {StorageProviderContract}
     */
    static disk<T extends keyof DriverTypes, K extends keyof DisksList>(disk: K): StorageProviderContract;
    /**
     * Access the storage provider adapter statically
     * This will resolve a new instance of the provider from the container
     */
    static getAdapter<T extends StorageProviderContract>(): T;
    /**
     * Get the files from the target directory
     *
     * @param directory
     * @param recursive
     */
    static files(directory: string, recursive?: boolean): Promise<string[]>;
    /**
     * Get all directories in the directory
     *
     * @param directory
     */
    static directories(directory: string): Promise<string[]>;
    /**
     * Create a new directory
     *
     * @param directory
     */
    static makeDirectory(directory: string): Promise<boolean>;
    /**
     * Delete a directory
     *
     * @param directory
     */
    static deleteDirectory(directory: string): Promise<boolean>;
    /**
     * Check if a file exists at the location
     *
     * @param key
     */
    static fileExists(key: string): Promise<boolean>;
    /**
     * Get the contents of a file
     *
     * @param location
     */
    static get(location: string): Promise<string>;
    /**
     * Create a new file and put the contents
     *
     * @param location
     * @param file
     */
    static put(location: string, file: StoragePutOptions): Promise<UploadedFileInformation>;
    /**
     * Delete a file
     *
     * @param location
     */
    static remove(location: string): Promise<boolean>;
    /**
     * Get the url for the file
     *
     * @param location
     */
    static url(location: string): string;
    /**
     * Get a temporary url for the file
     * (only works if it's an S3 based provider)
     *
     * @param location
     * @param expiresInSeconds
     */
    static temporaryUrl(location: string, expiresInSeconds: number): Promise<string>;
    /**
     * When we have a file upload, we will pass the original file name
     * to this method, along with it's stream. This method will store
     * it in the storage's temp file directory and return it's name.
     *
     * @param fileName
     * @param stream
     */
    static saveTemporaryFile(fileName: string, stream: NodeJS.ReadableStream): Promise<string>;
    /**
     * Return the adapter set on this instance
     *
     * @private
     */
    private getProvider;
}
