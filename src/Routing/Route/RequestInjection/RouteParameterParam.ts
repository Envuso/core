import {FastifyReply, FastifyRequest} from "fastify";
import {DecoratorHelpers, METADATA} from "../../../Common";
import {param} from "../RouteDecorators";
import {MethodParameterDecorator, ReflectControllerMethodParamData} from "./MethodParameterDecorator";

export class RouteParameterParam extends MethodParameterDecorator {
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

		const routeParameterParam = new RouteParameterParam(
			parameterNames[reflector.parameterIndex],
			types[reflector.parameterIndex],
			reflector.parameterIndex
		);

		this.setMetadata(reflector, routeParameterParam);
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, param: RouteParameterParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_METHOD_ROUTE_PARAMETER, param, target);
	}

	static getMetadata(target: Function): RouteParameterParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_ROUTE_PARAMETER, target);
	}

	public canBind(target: Function, param: any, parameterIndex: number) {

		if (parameterIndex !== this.paramIndex) {
			return false;
		}

		return this.expectedParamType === param;
	}

	bind(request: FastifyRequest, response: FastifyReply) {
		const paramValue = request.params[this.parameterName];
		const param      = this.expectedParamType(paramValue);

		return param ?? null;
	}

}
