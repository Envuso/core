import { FastifyReply, FastifyRequest } from "fastify";
import { DataTransferObject } from "../DataTransferObject";
import { ControllerRequestParamDecorator, ReflectControllerMethodParamData } from "./ControllerRequestParamDecorator";
export declare class DataTransferObjectParam extends ControllerRequestParamDecorator {
    private dtoParameter;
    private validateOnRequest;
    constructor(dtoParameter: typeof DataTransferObject, validateOnRequest?: boolean);
    static handleParameter(reflector: ReflectControllerMethodParamData, validateOnRequest?: boolean): void;
    private static setMetadata;
    static getMetadata(target: Function): DataTransferObjectParam | undefined;
    bind(request: FastifyRequest, response: FastifyReply): Promise<DataTransferObject>;
    static canInject(target: any, key: string | symbol): boolean;
}
