/// <reference types="node" />
import { FileUpload } from "@Providers/Http/Context/Request/FileUpload";
import { FastifyRequest } from "fastify";
export declare class HttpRequest {
    private readonly _request;
    constructor(request: FastifyRequest);
    get fastifyRequest(): FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage>;
    file(field: string): FileUpload;
}
