import { FastifyReply, FastifyRequest } from "fastify";
import { DataTransferObject } from "../../DataTransferObject/DataTransferObject";
import { MethodParameterDecorator, ReflectControllerMethodParamData } from "./MethodParameterDecorator";
export declare class DataTransferObjectParam extends MethodParameterDecorator {
    private dtoParameter;
    private validateOnRequest;
    constructor(dtoParameter: typeof DataTransferObject, validateOnRequest?: boolean);
    static handleParameter(reflector: ReflectControllerMethodParamData, validateOnRequest?: boolean): void;
    private static setMetadata;
    static getMetadata(target: Function): DataTransferObjectParam | undefined;
    bind(request: FastifyRequest, response: FastifyReply): Promise<DataTransferObject>;
    static canInject(target: any, key: string | symbol): boolean;
}
