/// <reference types="node" />
import { FastifyRequest } from "fastify";
import { FileUpload } from "@Core";
export declare class HttpRequest {
    private readonly _request;
    constructor(request: FastifyRequest);
    get fastifyRequest(): FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage>;
    file(field: string): FileUpload;
}
