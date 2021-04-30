import {FastifyReply, FastifyRequest} from "fastify";
import {METADATA} from "../../../Common";
import {RequestContext} from "../../Context/RequestContext";
import {MethodParameterDecorator, ReflectControllerMethodParamData} from "./MethodParameterDecorator";

export class RequestParam extends MethodParameterDecorator {

	constructor() {
		super(null);
	}

	static handleParameter(reflector: ReflectControllerMethodParamData) {
		const paramHandler = new RequestParam();
		this.setMetadata(reflector, paramHandler);
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, param: RequestParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_METHOD_FASTIFY_REQUEST, param, target);
	}

	static getMetadata(target: Function): RequestParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_FASTIFY_REQUEST, target);
	}

	public canBind(target: Function, param: any, parameterIndex: number) {
		return this instanceof RequestParam;
	}

	bind(request: FastifyRequest, response: FastifyReply) {
		return RequestContext.get().request;
	}

}
