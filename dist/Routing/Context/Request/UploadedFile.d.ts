import { FastifyRequest } from "fastify";
import { Multipart } from "fastify-multipart";
import { UploadedFileInformation } from "../../../Storage";
export declare class UploadedFile {
    private file;
    private tempFileName;
    constructor(file: Multipart, tempFileName: string);
    /**
     * Get the name of the field that this file was submitted via
     */
    getFieldName(): string;
    /**
     * Get the absolute path of the temporary file
     */
    getTempFilePath(): string;
    /**
     * Store the uploaded file in the specified directory.
     *
     * @param location
     */
    store(location: string): Promise<UploadedFileInformation>;
    /**
     * Store the uploaded file in the specified directory using
     * a user specified file name, rather than generated.
     *
     * @param location
     * @param fileName
     */
    storeAs(location: string, fileName: string): Promise<UploadedFileInformation>;
    /**
     * Store the file from the request on our default storage provider
     *
     * This method handles store() and storeAs() so there's less code for those methods.
     *
     * @param location
     * @param storeAs
     */
    private storeFile;
    /**
     * If the temp file exists, it will be deleted.
     */
    deleteTempFile(): void;
    /**
     * We will bind the uploaded file from the request into our request
     * context, so that it is ready to be processed and any async operations
     * have already been handled and are completed.
     *
     * @param request
     */
    static addToRequest(request: FastifyRequest): Promise<void>;
}
