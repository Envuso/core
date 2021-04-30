import {Request} from "./Context/Request/Request";
import {RequestContext} from "./Context/RequestContext";
import {Response} from "./Context/Response/Response";
import {Session} from "./Context/Session";

export * from './RouteServiceProvider';
export * from './Context/Request/Request';
export * from './Context/Request/UploadedFile';
export * from './Context/Session';
export * from './Context/CookieJar';
export * from './Context/Response/Response';
export * from './Context/RequestContext';
export * from './Context/RequestContextStore';
export * from './Context/RequestContext';
export * from './Context/RequestContextStore';
export * from './Controller/Controller';
export * from './Controller/ControllerManager';
export * from './Controller/ControllerDecorators';
export * from './DataTransferObject/DataTransferObject';
export * from './DataTransferObject/DtoValidationException';
export * from './Middleware/Middleware';
export * from './Middleware/MiddlewareDecorators';
export * from './Route/RequestInjection/index';
export * from './Route/Route';
export * from './Route/RouteDecorators';
export * from './Route/RouteManager';
export * from './Middleware/Middlewares/JwtAuthenticationMiddleware';


export const context  = (): RequestContext => RequestContext.get();
export const session  = (): Session => RequestContext.session();
export const response = (): Response => RequestContext.response();

function request(): Request;
function request<T>(key: string): T;
function request<T>(key?: string, _default = null): T | Request {
	if (key)
		return RequestContext.request().get<T>(key, _default);

	return RequestContext.request() as Request;
}

export {request};

//export const request = (): Request => {
//	return RequestContext.request() as Request;
//};
//export const request = <T>(key?: string, _default = null): T => {
//	return RequestContext.request().get<T>(key, _default);
//};
