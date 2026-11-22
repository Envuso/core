import {Url} from "../Common/Utility/Url";
import type {RequestContextContract} from "../Contracts/Routing/Context/RequestContextContract";
import type {RequestContract} from "../Contracts/Routing/Context/Request/RequestContract";
import type {RedirectResponseContract} from "../Contracts/Routing/Context/Response/RedirectResponseContract";
import type {ResponseContract} from "../Contracts/Routing/Context/Response/ResponseContract";
import {RequestContext} from "./Context/RequestContext";

export const context  = (): RequestContextContract => RequestContext.get();
export const response = (): ResponseContract => RequestContext.response();

export const route = (controllerAndMethod: string, attributes?: any): string => Url.routeUrl(controllerAndMethod, attributes);

export function request(): RequestContract;
export function request<T>(key: string): T;
export function request<T>(key?: string, _default = null): T | RequestContract {
	if (key)
		return RequestContext.request().get<T>(key, _default);

	return RequestContext.request() as RequestContract;
}

export function view(templatePath: string, data?: any): ResponseContract {
	return response().view(templatePath, data);
}

export function redirect(url: string): RedirectResponseContract;
export function redirect(): RedirectResponseContract;
export function redirect(url?: string): RedirectResponseContract {
	if (url !== undefined) {
		return response().redirect(url);
	}
	return response().redirectResponse();
}

export function back(): RedirectResponseContract {
	return response().redirectResponse().back();
}
