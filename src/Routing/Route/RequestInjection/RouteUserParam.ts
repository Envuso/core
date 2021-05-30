import {FastifyReply, FastifyRequest} from "fastify";
import {resolve} from "../../../AppContainer";
import {Authentication} from "../../../Authentication";
import {DecoratorHelpers, METADATA} from "../../../Common";
import {RequestContext} from "../../Context/RequestContext";
import {MethodParameterDecorator, ReflectControllerMethodParamData} from "./MethodParameterDecorator";

export class RouteUserParam extends MethodParameterDecorator {

	private parameterName: string;
	private paramIndex: number;

	constructor(parameterName: string, type: Function, paramIndex: number) {
		super(type);
		this.parameterName = parameterName;
		this.paramIndex    = paramIndex;
	}

	static handleParameter(reflector: ReflectControllerMethodParamData) {
		const types          = DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);
		const parameterNames = DecoratorHelpers.getParameterNames(reflector.target[reflector.propertyKey]);

		const authedUserParameter = new RouteUserParam(
			parameterNames[reflector.parameterIndex],
			types[reflector.parameterIndex],
			reflector.parameterIndex
		);

		this.setMetadata(reflector, authedUserParameter);
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, param: RouteUserParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_AUTHENTICATED_USER, param, target);
	}

	static getMetadata(target: Function): RouteUserParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_AUTHENTICATED_USER, target);
	}

	bind(request: FastifyRequest, response: FastifyReply) {
		return resolve(Authentication).user().getUser();
	}

}
