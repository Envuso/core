import { Multipart } from "fastify-multipart";
export interface UploadedFileInformation {
    url: string;
    path: string;
    originalName: string;
}
export declare abstract class StorageProvider {
    abstract files(directory: string): any;
    abstract directories(directory: string): Promise<string[]>;
    abstract makeDirectory(directory: string): any;
    abstract deleteDirectory(directory: string): any;
    abstract fileExists(key: string): any;
    abstract put(location: string, file: Multipart): Promise<UploadedFileInformation>;
    abstract remove(location: string): any;
    abstract get(location: string): any;
    abstract url(location: string): any;
    abstract temporaryUrl(location: string, expiresInSeconds: number): any;
}
