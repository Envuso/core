import {
	RouteQueryParam,
	DataTransferObjectParam,
	RequestBodyParam,
	RequestHeadersParam,
	RouteParameterParam,
} from "./RequestInjection";
import {RouteUserParam} from "./RequestInjection/RouteUserParam";

export function dto(validateOnRequest?: boolean): ParameterDecorator {
	return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
		DataTransferObjectParam.handleParameter(
			{target, propertyKey, parameterIndex}, validateOnRequest
		);
	};
}

/**
 * This will allow us to bind a route parameter to the controller method parameter
 *
 * For example, we define a GET route: @get('/api/:username')
 *
 * We can now add a @param decorator that matches the name of the route parameter (username)
 *
 * Something like:
 * @get('/api/:username')
 * getUsername(@param username : string)
 *
 * @param {Object} target
 * @param {string | symbol} propertyKey
 * @param {number} parameterIndex
 */
export const param = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RouteParameterParam.handleParameter({target, propertyKey, parameterIndex});
};

/**
 * This will allow us to bind a specific request query parameter to our method
 *
 * For example, we want to read the value of id on /api/page?id=1234
 * We can use controllerMethod(@query id : number)
 *
 * The name of the parameter in your controller method matters.
 * We will be looking in the query params for this keys name.
 *
 *
 * @param {Object} target
 * @param {string | symbol} propertyKey
 * @param {number} parameterIndex
 */
export const query = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RouteQueryParam.handleParameter({target, propertyKey, parameterIndex});
};

/**
 * This will bind our whole request body and query to the provided controller method parameter
 *
 * @param {Object} target
 * @param {string | symbol} propertyKey
 * @param {number} parameterIndex
 */
export const body = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RequestBodyParam.handleParameter({target, propertyKey, parameterIndex});
};

/**
 * This will set all of the incoming requests headers to our method parameter
 *
 * @param {Object} target
 * @param {string | symbol} propertyKey
 * @param {number} parameterIndex
 */
export const headers = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RequestHeadersParam.handleParameter({target, propertyKey, parameterIndex});
};

/**
 * This will set the currently authenticated user instance to our method parameter
 * This will be null if there is no authenticated user.
 *
 * @param {Object} target
 * @param {string | symbol} propertyKey
 * @param {number} parameterIndex
 */
export const user = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
	RouteUserParam.handleParameter({target, propertyKey, parameterIndex});
};

