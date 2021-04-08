import { HttpRequest, UploadedFileInformation } from "Core";
export declare class FileUpload {
    private request;
    private field;
    constructor(request: HttpRequest, field: string);
    store(location: string): Promise<UploadedFileInformation>;
}
