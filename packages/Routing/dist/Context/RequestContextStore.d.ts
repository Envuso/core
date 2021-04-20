import { FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { RequestContext } from "./RequestContext";
export declare class RequestContextStore {
    private readonly _store;
    constructor();
    static getInstance(): RequestContextStore;
    context(): RequestContext;
    bind(request: FastifyRequest, done: HookHandlerDoneFunction): void;
}
