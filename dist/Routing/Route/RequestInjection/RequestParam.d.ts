import { FastifyReply, FastifyRequest } from "fastify";
import { MethodParameterDecorator, ReflectControllerMethodParamData } from "./MethodParameterDecorator";
export declare class RequestParam extends MethodParameterDecorator {
    constructor();
    static handleParameter(reflector: ReflectControllerMethodParamData): void;
    private static setMetadata;
    static getMetadata(target: Function): RequestParam | undefined;
    canBind(target: Function, param: any, parameterIndex: number): boolean;
    bind(request: FastifyRequest, response: FastifyReply): import("../..").Request;
}
