import type {FastifyReply, FastifyRequest} from "fastify";
import {METADATA} from "../../../Common/Decorators/RoutingMetaData";
import type {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {MethodParameterDecorator, type ReflectControllerMethodParamData} from "./MethodParameterDecorator";


export class RequestHeadersParam extends MethodParameterDecorator {

	constructor(parameterIndex: number) {
		super(null)
		this.parameterIndex = parameterIndex;
	}

	public static handleParameter(reflector: ReflectControllerMethodParamData) {
		this.setMetadata(reflector, new RequestHeadersParam(reflector.parameterIndex))
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, dtoParam: RequestHeadersParam) {
		MethodParameterDecorator.store(METADATA.REQUEST_METHOD_HEADERS, reflector, dtoParam);
	}

	static getMetadata(target: Function): RequestHeadersParam[] | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_HEADERS, target);
	}

	bind(request: FastifyRequest, response: FastifyReply, context: RequestContextContract) {
		return request.headers;
	}
}
