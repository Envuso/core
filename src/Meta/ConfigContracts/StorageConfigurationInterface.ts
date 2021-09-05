import { DisksList, DriversList } from "../../Storage";

export interface StorageConfigurationInterface {
    /**
     * The default storage provider to use on the request() helper
     * or when using Storage.get(), Storage.put() etc
     */
    defaultDisk: string | number;
    disks: DisksList;
    drivers: DriversList;
}
