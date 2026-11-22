import type {FastifyReply, FastifyRequest} from "fastify";
import {METADATA} from "../../../Common/Decorators/RoutingMetaData";
import type {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";

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

	/**
	 * The position of the method parameter this decorator is on
	 */
	public parameterIndex: number = null;

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
	 * Record this decorator for its parameter. A method keeps a list per decorator type,
	 * so using one twice (e.g. two @query params) no longer overwrites the first.
	 */
	static store(metadata: METADATA, reflector: ReflectControllerMethodParamData, param: MethodParameterDecorator) {
		const target = reflector.target[reflector.propertyKey];
		const stored = Reflect.getOwnMetadata(metadata, target);
		const list   = stored === undefined ? [] : (Array.isArray(stored) ? stored : [stored]);

		param.parameterIndex = reflector.parameterIndex;

		Reflect.defineMetadata(metadata, [...list, param], target);
	}

	/**
	 * This will return the required/formatted data for the route method parameter
	 *
	 * It's undefined here, as it's base class that others will extend
	 *
	 * @param request
	 * @param response
	 * @param context
	 */
	bind(request: FastifyRequest, response: FastifyReply, context: RequestContextContract) {
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
		// Decorators are per parameter: bind the one at our position
		if (this.parameterIndex !== null) {
			return this.parameterIndex === parameterIndex;
		}

		return this.expectedParamType.prototype === param.prototype;
	}

}
