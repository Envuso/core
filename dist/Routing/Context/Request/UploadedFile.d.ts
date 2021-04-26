/// <reference types="node" />
import { FastifyRequest } from "fastify";
import { Multipart } from "fastify-multipart";
import { Stats } from "fs";
import { UploadedFileInformation } from "../../../Storage";
import { FileExtension, MimeType } from 'file-type';
export declare class UploadedFile {
    private file;
    private tempFileName;
    private _extension;
    private _mimeType;
    constructor(file: Multipart, tempFileName: string);
    /**
     * Get the mimetype of the uploaded file
     *
     * @returns {MimeType|null}
     */
    getMimeType(): MimeType;
    /**
     * This should only be used as a fallback if {@see getMimeType()} returns null
     *
     * It might not be a supported file type in this case.
     * @see https://github.com/sindresorhus/file-type#supported-file-types
     *
     * @returns {FileExtension}
     */
    getOriginalMimeType(): MimeType;
    /**
     * Get the encoder type for the file upload
     *
     * @returns {string}
     */
    getEncoding(): string;
    /**
     * Get the extension of the file, this is theoretically
     * safe and taken from the file contents directly.
     *
     * @returns {FileExtension | null}
     */
    getExtension(): FileExtension;
    /**
     * Get the fs stat values
     *
     * @returns {Stats}
     */
    getFileStat(): Stats;
    /**
     * Get the size of the file in bytes
     *
     * @returns {number}
     */
    getSize(): number;
    /**
     * This should only be used as a fallback if {@see getExtension()} returns null
     *
     * It might not be a supported file type in this case.
     * @see https://github.com/sindresorhus/file-type#supported-file-types
     *
     * @returns {FileExtension}
     */
    getOriginalExtension(): FileExtension;
    /**
     * Get the name of the field that this file was submitted via
     */
    getFieldName(): string;
    /**
     * Get the temp file name assigned after uploading the file
     *
     * @returns {string}
     */
    getTempFileName(): string;
    /**
     * Get the absolute path of the temporary file
     */
    getTempFilePath(): string;
    /**
     * Get the file name stored in temp storage
     *
     * @returns {string}
     */
    getOriginalFileName(): string;
    /**
     * Get the file name without the extension
     *
     * @returns {string}
     */
    getFileNameWithoutExtension(): string;
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
    /**
     * Should not be used, this is internal framework logic
     *
     * @returns {Promise<void>}
     * @private
     */
    setAdditionalInformation(): Promise<void>;
}
