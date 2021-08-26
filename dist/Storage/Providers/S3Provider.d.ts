import { DeleteObjectOutput } from "aws-sdk/clients/s3";
import { StorageConfig } from "../../Config/Storage";
import { StorageProviderContract, StoragePutOptions, UploadedFileInformation } from "../StorageProviderContract";
export declare class S3Provider extends StorageProviderContract {
    private s3;
    private _config;
    constructor(config: StorageConfig);
    /**
     * Get the files from the target directory
     *
     * @param directory
     */
    files(directory: string): Promise<unknown>;
    /**
     * Get all directories in the directory
     *
     * @param directory
     */
    directories(directory: string): Promise<string[]>;
    /**
     * Create a new directory
     *
     * @param directory
     */
    makeDirectory(directory: string): Promise<boolean>;
    /**
     * Delete a directory
     *
     * @param directory
     */
    deleteDirectory(directory: string): Promise<DeleteObjectOutput>;
    /**
     * Check if a file exists at the location
     *
     * @param key
     */
    fileExists(key: string): Promise<boolean>;
    /**
     * Get the contents of a file
     *
     * @param location
     */
    get(location: string): Promise<unknown>;
    /**
     * Create a new file and put the contents
     *
     * @param location
     * @param file
     */
    put(location: string, file: StoragePutOptions): Promise<UploadedFileInformation>;
    /**
     * Delete a file
     *
     * @param location
     */
    remove(location: string): Promise<boolean>;
    /**
     * Get the url for the file
     *
     * @param location
     */
    url(location: string): string;
    /**
     * Get a temporary url for the file
     * (only works if it's an S3 based provider)
     *
     * @param location
     * @param expiresInSeconds
     */
    temporaryUrl(location: string, expiresInSeconds: number): Promise<string>;
}
