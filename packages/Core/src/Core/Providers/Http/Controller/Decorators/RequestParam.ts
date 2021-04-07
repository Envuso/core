import {FastifyReply, FastifyRequest} from "fastify";
import {METADATA} from "../../../../DecoratorData";
import {ControllerRequestParamDecorator, ReflectControllerMethodParamData} from "./ControllerRequestParamDecorator";

export class RequestParam extends ControllerRequestParamDecorator {

	constructor() {
		super(null);
	}

	static handleParameter(reflector: ReflectControllerMethodParamData) {
		const paramHandler = new RequestParam();
		this.setMetadata(reflector, paramHandler)
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, param: RequestParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_METHOD_FASTIFY_REQUEST, param, target)
	}

	static getMetadata(target: Function): RequestParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_FASTIFY_REQUEST, target);
	}

	public canBind(target : Function, param: any, parameterIndex : number) {
		return this instanceof RequestParam;
	}

	async bind(request: FastifyRequest, response: FastifyReply) {
		return request;
	}

}
