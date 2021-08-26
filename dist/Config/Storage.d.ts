import { S3Provider } from "../Storage/Providers/S3Provider";
import { StorageProviderContract } from "../Storage/StorageProviderContract";
export declare type S3Config = {
    bucket: string;
    url: string;
    endpoint: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    };
};
export interface StorageConfig {
    defaultProvider: new (storageConfig: StorageConfig) => StorageProviderContract;
    s3: S3Config;
}
declare const _default: {
    /**
     * The default storage provider to use on the request() helper
     * or when using Storage.get(), Storage.put() etc
     */
    defaultProvider: typeof S3Provider;
    /**
     * Your S3 config
     * (Should hopefully work for other services like DigitalOcean Spaces also)
     */
    s3: S3Config;
};
export default _default;
