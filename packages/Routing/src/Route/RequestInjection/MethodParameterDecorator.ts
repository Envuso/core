import {METADATA} from "@envuso/common";
import {FastifyReply, FastifyRequest} from "fastify";

export interface ReflectControllerMethodParamData {
	propertyKey: string | symbol;
	parameterIndex: number;
	target: Object;
}


export class MethodParameterDecorator {

	/**
	 * The type we're expecting the instance to be of
	 * With this we can do some type checks.
	 */
	public expectedParamType: any;

	constructor(paramType: any) {
		this.expectedParamType = paramType;
	}

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
	static getMethodMetadata<T>(target: Function, metadata: METADATA): T {
		return Reflect.getMetadata(metadata, target);
	}

	/**
	 * This will return the required/formatted data for the route method parameter
	 *
	 * It's undefined here, as it's base class that others will extend
	 *
	 * @param request
	 * @param response
	 */
	async bind(request: FastifyRequest, response: FastifyReply) {
		return undefined;
	}

	/**
	 * We will define logic in each instance to see if we
	 * can bind this instance to the route parameter.
	 *
	 * @param target
	 * @param param
	 * @param parameterIndex
	 */
	public canBind(target: Function, param: any, parameterIndex: number) {
		return this.expectedParamType.prototype === param.prototype;
	}

}
