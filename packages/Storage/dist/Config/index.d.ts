import { StorageServiceProvider } from "../src/StorageServiceProvider";
export declare const Config: {
    app: {
        providers: (typeof StorageServiceProvider)[];
    };
    storage: {
        defaultProvider: typeof import("..").S3Provider;
        s3: import("./Storage").S3Config;
    };
};
