import { FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { HttpContext } from "./HttpContext";
export declare class HttpContextStore {
    private readonly _store;
    constructor();
    static getInstance(): HttpContextStore;
    context(): HttpContext;
    bind(request: FastifyRequest, done: HookHandlerDoneFunction): void;
}
