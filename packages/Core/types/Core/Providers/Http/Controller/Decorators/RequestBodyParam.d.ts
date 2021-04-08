import { FastifyReply, FastifyRequest } from "fastify";
import { ControllerRequestParamDecorator, ReflectControllerMethodParamData } from "./ControllerRequestParamDecorator";
export declare class RequestBodyParam extends ControllerRequestParamDecorator {
    private parameterIndex;
    constructor(parameterIndex: number);
    static handleParameter(reflector: ReflectControllerMethodParamData, validateOnRequest?: boolean): void;
    private static setMetadata;
    static getMetadata(target: Function): RequestBodyParam | undefined;
    canBind(target: Function, param: any, parameterIndex: number): boolean;
    bind(request: FastifyRequest, response: FastifyReply): Promise<unknown>;
}
