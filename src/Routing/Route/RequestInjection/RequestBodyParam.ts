import {FastifyReply, FastifyRequest} from "fastify";
import {METADATA} from "../../../Common";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {MethodParameterDecorator, ReflectControllerMethodParamData} from "./MethodParameterDecorator";


export class RequestBodyParam extends MethodParameterDecorator {
	private parameterIndex: number;

	constructor(parameterIndex: number) {
		super(null)
		this.parameterIndex = parameterIndex;
	}

	public static handleParameter(reflector: ReflectControllerMethodParamData, validateOnRequest: boolean = true) {
		this.setMetadata(reflector, new RequestBodyParam(reflector.parameterIndex))
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, dtoParam: RequestBodyParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_METHOD_BODY, dtoParam, target)
	}

	static getMetadata(target: Function): RequestBodyParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_BODY, target);
	}

	public canBind(target: Function, param: any, parameterIndex: number) {
		return parameterIndex === this.parameterIndex;
	}

	bind(request: FastifyRequest, response: FastifyReply, context: RequestContextContract) {
		return request.body;
	}
}
