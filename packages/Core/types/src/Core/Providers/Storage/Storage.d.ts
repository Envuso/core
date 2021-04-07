import { StorageProvider } from "@Providers/Storage/StorageProvider";
import { Multipart } from "fastify-multipart";
export declare class Storage {
    static defaultProvider(): StorageProvider;
    static files(directory: string): any;
    static directories(directory: string): Promise<string[]>;
    static makeDirectory(directory: string): any;
    static deleteDirectory(directory: string): any;
    static fileExists(key: string): any;
    static get(location: string): any;
    static put(location: string, file: Multipart): Promise<import("@Providers/Storage/StorageProvider").UploadedFileInformation>;
    static remove(location: string): any;
    static url(location: string): any;
    static temporaryUrl(location: string, expiresInSeconds: number): any;
}
