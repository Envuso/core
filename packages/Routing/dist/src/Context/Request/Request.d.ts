/// <reference types="node" />
import { FastifyRequest, HTTPMethods } from "fastify";
export declare class Request {
    private readonly _request;
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
}
