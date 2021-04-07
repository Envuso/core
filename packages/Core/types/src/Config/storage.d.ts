import { SpacesProvider } from "@Providers/Storage/StorageProviders/SpacesProvider";
export declare const storage: {
    defaultProvider: typeof SpacesProvider;
    spaces: {
        bucket: string;
        url: string;
        endpoint: string;
        credentials: {
            accessKeyId: string;
            secretAccessKey: string;
        };
    };
};
