import {RequestContextContract} from "../Contracts/Routing/Context/RequestContextContract";
import {RequestContract} from "../Contracts/Routing/Context/Request/RequestContract";
import {RedirectResponseContract} from "../Contracts/Routing/Context/Response/RedirectResponseContract";
import {ResponseContract} from "../Contracts/Routing/Context/Response/ResponseContract";
import {RequestContext} from "./Context/RequestContext";

export const context  = (): RequestContextContract => RequestContext.get();
export const response = (): ResponseContract => RequestContext.response();

function request(): RequestContract;
function request<T>(key: string): T;
function request<T>(key?: string, _default = null): T | RequestContract {
	if (key)
		return RequestContext.request().get<T>(key, _default);

	return RequestContext.request() as RequestContract;
}

function view(templatePath: string, data?: any): ResponseContract {
	return response().view(templatePath, data);
}

function redirect(url: string): RedirectResponseContract;
function redirect(): RedirectResponseContract;
function redirect(url?: string): RedirectResponseContract {
	if (url !== undefined) {
		return response().redirect(url);
	}
	return response().redirectResponse();
}

function back(): RedirectResponseContract {
	return response().redirectResponse().back();
}

export * from './Controller/Controller';
export * from './DataTransferObject/DataTransferObject';
export * from './DataTransferObject/DtoValidationException';
export * from './Route/RouteDecorators';
export * from './Route/Route';
export * from './Route/Routing';
export * from './Controller/ControllerDecorators';
export * from './Middleware/Middleware';
export * from './Middleware/MiddlewareDecorators';
export * from './Middleware/Middlewares/VerifyCsrfTokenMiddleware';
export * from './Middleware/Middlewares/JwtAuthenticationMiddleware';
export * from './Context/Response/Response';
export * from './Context/Request/Request';

export {request, view, redirect, back, RequestContext};

