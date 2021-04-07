import { StorageProvider, UploadedFileInformation } from "@Providers/Storage/StorageProvider";
import { DeleteObjectOutput } from "aws-sdk/clients/s3";
import { Multipart } from "fastify-multipart";
export declare class SpacesProvider extends StorageProvider {
    private spaces;
    constructor();
    files(directory: string): Promise<unknown>;
    directories(directory: string): Promise<string[]>;
    makeDirectory(directory: string): Promise<boolean>;
    deleteDirectory(directory: string): Promise<DeleteObjectOutput>;
    fileExists(key: string): Promise<boolean>;
    get(location: string): Promise<unknown>;
    put(location: string, file: Pick<Multipart, "filepath" | "filename"> & {
        storeAs?: string;
    }): Promise<UploadedFileInformation>;
    remove(location: string): Promise<boolean>;
    url(location: string): string;
    temporaryUrl(location: string, expiresInSeconds: number): Promise<string>;
}
