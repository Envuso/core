/// <reference path="../../../index.d.ts" />
/// <reference types="node" />
/// <reference types="node/http" />
import { FastifyReply, FastifyRequest } from "fastify";
import { MethodParameterDecorator, ReflectControllerMethodParamData } from "./MethodParameterDecorator";
export declare class RequestHeadersParam extends MethodParameterDecorator {
    private parameterIndex;
    constructor(parameterIndex: number);
    static handleParameter(reflector: ReflectControllerMethodParamData): void;
    private static setMetadata;
    static getMetadata(target: Function): RequestHeadersParam | undefined;
    canBind(target: Function, param: any, parameterIndex: number): boolean;
    bind(request: FastifyRequest, response: FastifyReply): import("http").IncomingHttpHeaders;
}
