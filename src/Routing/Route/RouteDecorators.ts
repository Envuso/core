import {DataTransferObjectParam} from "./RequestInjection/DataTransferObjectParam";
import {RequestBodyParam} from "./RequestInjection/RequestBodyParam";
import {RequestHeadersParam} from "./RequestInjection/RequestHeadersParam";
import {RouteParameterParam} from "./RequestInjection/RouteParameterParam";
import {RouteQueryParam} from "./RequestInjection/RouteQueryParam";

export function dto(validateOnRequest?: boolean): ParameterDecorator {
	return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
		DataTransferObjectParam.handleParameter(
			{target, propertyKey, parameterIndex}, validateOnRequest
		);
	}
}

export const param = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RouteParameterParam.handleParameter({target, propertyKey, parameterIndex});
}

export const query = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RouteQueryParam.handleParameter({target, propertyKey, parameterIndex});
}

export const body = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RequestBodyParam.handleParameter({target, propertyKey, parameterIndex});
}

export const headers = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RequestHeadersParam.handleParameter({target, propertyKey, parameterIndex});
};
