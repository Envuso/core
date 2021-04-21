import { FastifyReply, FastifyRequest } from "fastify";
import { METADATA } from "../../../Common";
export interface ReflectControllerMethodParamData {
    propertyKey: string | symbol;
    parameterIndex: number;
    target: Object;
}
export declare class MethodParameterDecorator {
    /**
     * The type we're expecting the instance to be of
     * With this we can do some type checks.
     */
    expectedParamType: any;
    constructor(paramType: any);
    /**
     * When we use a decorator, for the route method parameters
     * It will define metadata using reflect as an instance of
     * one of these MethodParameterDecorator classes
     *
     * When we get that metadata, it will be an instance of one of those.
     *
     * @param target
     * @param metadata
     */
    static getMethodMetadata<T>(target: Function, metadata: METADATA): T;
    /**
     * This will return the required/formatted data for the route method parameter
     *
     * It's undefined here, as it's base class that others will extend
     *
     * @param request
     * @param response
     */
    bind(request: FastifyRequest, response: FastifyReply): Promise<any>;
    /**
     * We will define logic in each instance to see if we
     * can bind this instance to the route parameter.
     *
     * @param target
     * @param param
     * @param parameterIndex
     */
    canBind(target: Function, param: any, parameterIndex: number): boolean;
}
