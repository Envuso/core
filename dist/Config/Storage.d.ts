import { LocalStorageProviderConfiguration, S3StorageProviderConfiguration, StorageProviderContract } from "../Storage";
export declare type DriverTypes = {
    local: LocalStorageProviderConfiguration & {
        driver: 'local';
    };
    s3: S3StorageProviderConfiguration & {
        driver: 's3';
    };
};
export declare type DiskConfiguration<T extends keyof DriverTypes> = DriverTypes[T];
export declare type DisksList = {
    [key: string]: (DiskConfiguration<'local'> | DiskConfiguration<'s3'>);
};
export interface StorageConfiguration {
    defaultDisk: keyof DisksList;
    disks: DisksList;
    drivers: {
        [K in keyof DriverTypes]: new (storageConfig: DiskConfiguration<K>) => StorageProviderContract;
    };
}
declare const _default: StorageConfiguration;
export default _default;
