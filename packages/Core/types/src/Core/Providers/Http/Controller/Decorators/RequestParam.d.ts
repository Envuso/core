/// <reference types="node" />
import { FastifyReply, FastifyRequest } from "fastify";
import { ControllerRequestParamDecorator, ReflectControllerMethodParamData } from "./ControllerRequestParamDecorator";
export declare class RequestParam extends ControllerRequestParamDecorator {
    constructor();
    static handleParameter(reflector: ReflectControllerMethodParamData): void;
    private static setMetadata;
    static getMetadata(target: Function): RequestParam | undefined;
    canBind(target: Function, param: any, parameterIndex: number): boolean;
    bind(request: FastifyRequest, response: FastifyReply): Promise<FastifyRequest<import("fastify/types/route").RouteGenericInterface, import("http").Server, import("http").IncomingMessage>>;
}
