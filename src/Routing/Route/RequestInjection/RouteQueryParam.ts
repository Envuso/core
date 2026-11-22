import type {FastifyReply, FastifyRequest} from "fastify";
import {DecoratorHelpers} from "../../../Common/Decorators/DecoratorHelpers";
import {METADATA} from "../../../Common/Decorators/RoutingMetaData";
import {Exception} from "../../../Common/Exception/Exception";
import {StatusCodes} from "../../../Common/Http/StatusCodes/StatusCodes";
import type {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {MethodParameterDecorator, type ReflectControllerMethodParamData} from "./MethodParameterDecorator";

export class RouteQueryParam extends MethodParameterDecorator {
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

		const routeParameterParam = new RouteQueryParam(
			parameterNames[reflector.parameterIndex],
			types[reflector.parameterIndex],
			reflector.parameterIndex
		);

		this.setMetadata(reflector, routeParameterParam);
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, param: RouteQueryParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_METHOD_QUERY_PARAMETER, param, target);
	}

	static getMetadata(target: Function): RouteQueryParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_QUERY_PARAMETER, target);
	}

	public canBind(target: Function, param: any, parameterIndex: number) {
		if (parameterIndex !== this.paramIndex) {
			return false;
		}

		return this.expectedParamType === param;
	}

	bind(request: FastifyRequest, response: FastifyReply, context: RequestContextContract) {
		const value = context.request.get(this.parameterName, null);

		if (value === null || value === undefined) {
			return null;
		}

		return RouteQueryParam.cast(this.parameterName, value, this.expectedParamType);
	}

	/**
	 * Convert a query string value to the parameter's declared type.
	 * Values that can't be converted are a 400, not a server error.
	 */
	static cast(name: string, value: any, type: Function) {
		// Repeated keys (?a=1&a=2) arrive as an array; a scalar parameter takes the last one
		const scalar = Array.isArray(value) && type !== Array ? value[value.length - 1] : value;

		switch (type) {
			case Number: {
				if (typeof scalar === 'string' && scalar.trim() === '') {
					return null;
				}
				const number = Number(scalar);
				if (Number.isNaN(number)) {
					throw new Exception(`Query parameter "${name}" must be a number.`, StatusCodes.BAD_REQUEST);
				}
				return number;
			}
			case Boolean: {
				const normalised = String(scalar).trim().toLowerCase();
				if (['true', '1', 'on', 'yes'].includes(normalised)) {
					return true;
				}
				if (['false', '0', 'off', 'no', ''].includes(normalised)) {
					return false;
				}
				throw new Exception(`Query parameter "${name}" must be true or false.`, StatusCodes.BAD_REQUEST);
			}
			case String:
				return String(scalar);
			case Array:
				return Array.isArray(value) ? value : [value];
			default:
				// Object, any, or a type we don't know how to convert: pass it through
				return value;
		}
	}

}
