import {METADATA} from "@envuso/common";
import {FastifyReply, FastifyRequest} from "fastify";
import {MethodParameterDecorator, ReflectControllerMethodParamData} from "./MethodParameterDecorator";


export class RequestHeadersParam extends MethodParameterDecorator {
	private parameterIndex: number;

	constructor(parameterIndex: number) {
		super(null)
		this.parameterIndex = parameterIndex;
	}

	public static handleParameter(reflector: ReflectControllerMethodParamData) {
		this.setMetadata(reflector, new RequestHeadersParam(reflector.parameterIndex))
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, dtoParam: RequestHeadersParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_METHOD_HEADERS, dtoParam, target)
	}

	static getMetadata(target: Function): RequestHeadersParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_HEADERS, target);
	}

	public canBind(target: Function, param: any, parameterIndex: number) {
		return parameterIndex === this.parameterIndex;
	}

	async bind(request: FastifyRequest, response: FastifyReply) {
		return request.headers;
	}
}
