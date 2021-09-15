import path from "path";
import qs from "querystring";
import {config} from "../../AppContainer";
import {Obj} from "../../Common";
import {Log} from "../../Common/Logger/Log";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {RequestContext} from "../Context/RequestContext";
import {Routing} from "./Routing";

export class UrlGenerator {

	constructor(public context?: RequestContextContract) {}

	public generateUrlForRoute<T extends string>(controllerAndMethod: T, attributes?: any): string | null {
		const route = Routing.get().getRouteByName(controllerAndMethod);

		if (!route) {
			Log.error(`The route you are trying to create a url for is not found: ${controllerAndMethod}`);

			return null;
		}

		return route.constructUrl(attributes);
	}

	/**
	 * Attempt to figure out the previous request url
	 *
	 * If not... fall back to / route
	 *
	 * @returns {string}
	 */
	public previous() {
		const context  = this.context ?? RequestContext.get();
		const referrer = context.request.getReferer();
		const url      = referrer ? referrer : this.getPreviousUrlFromSession();

		return url ?? this.to('/');
	}

	public getPreviousUrlFromSession(): string | null {
		const context = this.context ?? RequestContext.get();

		if (!context.hasSession()) {
			return null;
		}

		return context.session.store().previousUrl() ?? null;
	}

	public getAppRootUrl(): string {
		return config('app.url');
	}

	/**
	 * Not great... but it's a start, we can improve on this later
	 *
	 * @TODO: Extract some logic from Route.constructUrl and make more efficient/safe
	 *
	 * @param {string} pathStr
	 * @param {{[p: string]: any}} params
	 * @returns {string}
	 */
	public to(pathStr: string, params: { [key: string]: any } = {}): string {
		let url = this.getAppRootUrl();

		url = path.join(url, pathStr);

		if (!Obj.isEmpty(params)) {
			url += '?';
			url += qs.stringify(params);
		}

		return url;
	}

}
