import type {FastifyReply, FastifyRequest} from "fastify";
import {METADATA} from "../../../Common/Decorators/RoutingMetaData";
import type {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {MethodParameterDecorator, type ReflectControllerMethodParamData} from "./MethodParameterDecorator";


export class RequestBodyParam extends MethodParameterDecorator {

	constructor(parameterIndex: number) {
		super(null);
		this.parameterIndex = parameterIndex;
	}

	public static handleParameter(reflector: ReflectControllerMethodParamData, validateOnRequest: boolean = true) {
		this.setMetadata(reflector, new RequestBodyParam(reflector.parameterIndex));
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, dtoParam: RequestBodyParam) {
		MethodParameterDecorator.store(METADATA.REQUEST_METHOD_BODY, reflector, dtoParam);
	}

	static getMetadata(target: Function): RequestBodyParam[] | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_BODY, target);
	}

	bind(request: FastifyRequest, response: FastifyReply, context: RequestContextContract) {
		return context.request.all();
	}
}
