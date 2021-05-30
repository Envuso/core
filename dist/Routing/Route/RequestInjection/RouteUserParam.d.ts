import { FastifyReply, FastifyRequest } from "fastify";
import { MethodParameterDecorator, ReflectControllerMethodParamData } from "./MethodParameterDecorator";
export declare class RouteUserParam extends MethodParameterDecorator {
    private parameterName;
    private paramIndex;
    constructor(parameterName: string, type: Function, paramIndex: number);
    static handleParameter(reflector: ReflectControllerMethodParamData): void;
    private static setMetadata;
    static getMetadata(target: Function): RouteUserParam | undefined;
    bind(request: FastifyRequest, response: FastifyReply): unknown;
}
