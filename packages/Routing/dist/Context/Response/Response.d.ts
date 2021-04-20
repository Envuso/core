/// <reference types="node" />
import { FastifyReply } from "fastify";
import { StatusCodes } from "http-status-codes";
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
    constructor(response: FastifyReply);
    get fastifyReply(): FastifyReply<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify/types/route").RouteGenericInterface, unknown>;
    set code(code: StatusCodes);
    set data(data: any);
    get code(): StatusCodes;
    get data(): any;
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
