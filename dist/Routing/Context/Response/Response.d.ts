/// <reference types="node" />
import { FastifyReply } from "fastify";
import { StatusCodes } from "http-status-codes";
import { CookieJar } from "../CookieJar";
export declare class Response {
    /**
     * Hold the original fastify reply so we can access/use it when needed
     * @private
     */
    private readonly _response;
    /**
     * The data to be sent in this response
     * @private
     */
    private _data;
    /**
     * The response code to be sent
     * @private
     */
    private _code?;
    /**
     * Handles all cookies that will be sent on the request
     *
     * @type {CookieJar}
     * @private
     */
    private _cookieJar;
    constructor(response: FastifyReply);
    get fastifyReply(): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown>;
    cookieJar(): CookieJar;
    set code(code: StatusCodes);
    set data(data: any);
    get code(): StatusCodes;
    get data(): any;
    /**
     * Do we have x header set on the response?
     *
     * @param {string} header
     * @returns {boolean}
     */
    hasHeader(header: string): boolean;
    /**
     * Get x header from the response
     *
     * @param {string} header
     * @returns {string}
     */
    getHeader(header: string): string;
    /**
     * Apply a header to the response, this applies directly to the fastify response
     *
     * @param header
     * @param value
     */
    header(header: string, value: any): this;
    /**
     * Set the data & status code to return
     *
     * @param data
     * @param code
     */
    setResponse(data: any, code: StatusCodes): this;
    /**
     * Set the status code... can be chained with other methods.
     *
     * @param code
     */
    setCode(code: StatusCodes): this;
    /**
     * Send the data/status code manually
     */
    send(): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown>;
    /**
     * Send a redirect response to x url
     *
     * @param url
     */
    redirect(url: string): this;
    /**
     * Send a not found response
     *
     * @param data
     */
    notFound(data?: any): this;
    /**
     * Send a bad request response
     *
     * @param data
     */
    badRequest(data?: any): this;
    /**
     * Return json data
     *
     * @param data
     * @param code
     */
    json(data?: any, code?: StatusCodes): this;
}
