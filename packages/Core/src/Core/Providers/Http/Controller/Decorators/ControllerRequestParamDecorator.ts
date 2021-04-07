import {FastifyReply, FastifyRequest} from "fastify";
import {METADATA} from "../../../../DecoratorData";


export interface ReflectControllerMethodParamData {
	propertyKey: string | symbol;
	parameterIndex: number;
	target: Object;
}


export class ControllerRequestParamDecorator {

	public expectedParamType: any;

	constructor(paramType: any) {
		this.expectedParamType = paramType;
	}

	static getMethodMetadata<T>(target: Function, metadata: METADATA): T {
		return Reflect.getMetadata(metadata, target);
	}

	static hasInjectableParams(metadata: METADATA, target: any, key: string | symbol) {
		return !!this.getMethodMetadata(target[key], metadata);
	}

	async bind(request: FastifyRequest, response: FastifyReply) {
		return undefined;
	}

	public canBind(target: Function, param: any, parameterIndex : number) {
		return this.expectedParamType.prototype === param.prototype;
	}

}
