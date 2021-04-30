import { FastifyRequest } from "fastify";
import { SocketConnection } from "../../Sockets/SocketConnection";
import { RequestContext } from "./RequestContext";
export declare class RequestContextStore {
    private readonly _store;
    constructor();
    static getInstance(): RequestContextStore;
    context(): RequestContext;
    bind(request: FastifyRequest | SocketConnection, done: any): void;
}
