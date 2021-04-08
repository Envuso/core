import { HttpRequest } from "@Providers/Http";
import { UploadedFileInformation } from "@Providers/Storage/StorageProvider";
export declare class FileUpload {
    private request;
    private field;
    constructor(request: HttpRequest, field: string);
    store(location: string): Promise<UploadedFileInformation>;
}
