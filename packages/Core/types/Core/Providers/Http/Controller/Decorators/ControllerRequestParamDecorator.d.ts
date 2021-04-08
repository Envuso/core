import { FastifyReply, FastifyRequest } from "fastify";
import { METADATA } from "../../../../DecoratorData";
export interface ReflectControllerMethodParamData {
    propertyKey: string | symbol;
    parameterIndex: number;
    target: Object;
}
export declare class ControllerRequestParamDecorator {
    expectedParamType: any;
    constructor(paramType: any);
    static getMethodMetadata<T>(target: Function, metadata: METADATA): T;
    static hasInjectableParams(metadata: METADATA, target: any, key: string | symbol): boolean;
    bind(request: FastifyRequest, response: FastifyReply): Promise<any>;
    canBind(target: Function, param: any, parameterIndex: number): boolean;
}
