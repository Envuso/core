import {DataTransferObjectParam, RequestBodyParam, RequestHeadersParam, RouteParameterParam, RouteQueryParam} from "@Core";


export function dto(validateOnRequest?: boolean): ParameterDecorator {
	return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
		DataTransferObjectParam.handleParameter(
			{target, propertyKey, parameterIndex}, validateOnRequest
		);
	}
}

//export const request = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
//	RequestParam.handleParameter({target, propertyKey, parameterIndex});
//}

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
}

