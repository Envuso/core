import { SpacesProvider } from "Core";
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
