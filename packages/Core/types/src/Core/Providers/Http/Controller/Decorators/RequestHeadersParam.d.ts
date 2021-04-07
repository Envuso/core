/// <reference types="node" />
import { FastifyReply, FastifyRequest } from "fastify";
import { ControllerRequestParamDecorator, ReflectControllerMethodParamData } from "./ControllerRequestParamDecorator";
export declare class RequestHeadersParam extends ControllerRequestParamDecorator {
    private parameterIndex;
    constructor(parameterIndex: number);
    static handleParameter(reflector: ReflectControllerMethodParamData): void;
    private static setMetadata;
    static getMetadata(target: Function): RequestHeadersParam | undefined;
    canBind(target: Function, param: any, parameterIndex: number): boolean;
    bind(request: FastifyRequest, response: FastifyReply): Promise<import("http").IncomingHttpHeaders>;
}
