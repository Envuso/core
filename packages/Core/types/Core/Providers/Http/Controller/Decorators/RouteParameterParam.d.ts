import { FastifyReply, FastifyRequest } from "fastify";
import { ControllerRequestParamDecorator, ReflectControllerMethodParamData } from "./ControllerRequestParamDecorator";
export declare class RouteParameterParam extends ControllerRequestParamDecorator {
    private parameterName;
    private paramIndex;
    constructor(parameterName: string, type: Function, paramIndex: number);
    static handleParameter(reflector: ReflectControllerMethodParamData): void;
    private static setMetadata;
    static getMetadata(target: Function): RouteParameterParam | undefined;
    canBind(target: Function, param: any, parameterIndex: number): boolean;
    bind(request: FastifyRequest, response: FastifyReply): Promise<any>;
}
