/// <reference types="node" />
import { FastifyRequest, HTTPMethods } from "fastify";
import { Multipart } from "fastify-multipart";
import { UploadedFile } from "./UploadedFile";
export declare class Request {
    private readonly _request;
    /**
     * If this request contains files that have been uploaded
     *
     * Then we will store some information about them here.
     * At this stage, they have been semi-processed and are
     * ready to be accessed without async code
     *
     * @private
     */
    private _uploadedFiles;
    constructor(request: FastifyRequest);
    get fastifyRequest(): FastifyRequest;
    /**
     * Get the value of a header from the request
     *
     * @param header
     * @param _default
     */
    header(header: string, _default?: any): string;
    /**
     * Get all of the headers from the request
     */
    headers(): import("http").IncomingHttpHeaders;
    /**
     * Get the body of the request
     */
    body<T>(): T;
    /**
     * Get the ip the request originated from
     */
    ip(): string;
    /**
     * an array of the IP addresses, ordered from closest to furthest,
     * in the X-Forwarded-For header of the incoming request
     * (only when the trustProxy option is enabled)
     *
     * @see https://www.fastify.io/docs/latest/Request/
     */
    ips(): string[];
    /**
     * The full url of the incoming request
     */
    url(): string;
    /**
     * The method of the incoming request, GET, PUT etc
     */
    method(): HTTPMethods;
    /**
     * The id assigned to this request
     */
    id(): any;
    /**
     * Get a value from the request body
     *
     * @param key
     * @param _default
     */
    get(key: string, _default?: any): any;
    /**
     * Set file information that has been processed and is
     * ready to upload/stream to s3 etc
     *
     * @param file
     */
    setUploadedFile(file: Multipart): Promise<void>;
    /**
     * Does the request contain any files?
     */
    hasFiles(): boolean;
    /**
     * Get all files on the request
     */
    files(): UploadedFile[];
    /**
     * Get a singular file on the request
     *
     * @param key
     */
    file(key: string): UploadedFile | null;
}
