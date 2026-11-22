import type {FastifyReply, FastifyRequest} from "fastify";
import {METADATA} from "../../../Common/Decorators/RoutingMetaData";
import type {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {RequestContext} from "../../Context/RequestContext";
import {MethodParameterDecorator, type ReflectControllerMethodParamData} from "./MethodParameterDecorator";

export class RequestParam extends MethodParameterDecorator {

	constructor() {
		super(null);
	}

	static handleParameter(reflector: ReflectControllerMethodParamData) {
		const paramHandler = new RequestParam();
		this.setMetadata(reflector, paramHandler);
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, param: RequestParam) {
		MethodParameterDecorator.store(METADATA.REQUEST_METHOD_FASTIFY_REQUEST, reflector, param);
	}

	static getMetadata(target: Function): RequestParam[] | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_FASTIFY_REQUEST, target);
	}

	bind(request: FastifyRequest, response: FastifyReply, context: RequestContextContract) {
		return context.request;
	}

}
