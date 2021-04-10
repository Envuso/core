import { FastifyRequest } from "fastify";
export declare class Request {
    private readonly _request;
    constructor(request: FastifyRequest);
    get fastifyRequest(): FastifyRequest;
}
