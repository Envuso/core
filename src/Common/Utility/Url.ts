import {config} from "../../AppContainer";
import {Routing} from "../../Routing/Route/Routing";
import {Log} from "../Logger/Log";

export class Url {

	/**
	 * Generate a url for a controller method
	 *
	 * @param {T} controllerAndMethod
	 * @param attributes
	 * @returns {string | null}
	 */
	public static routeUrl<T extends string>(controllerAndMethod: T, attributes?: any): string | null {
		const route = Routing.get().getRouteByName(controllerAndMethod);

		if (!route) {
			Log.error(`The route you are trying to create a url for is not found: ${controllerAndMethod}`);

			return null;
		}

		return route.constructUrl(attributes);
	}

	/**
	 * Get the url defined in the app config
	 *
	 * @returns {string}
	 */
	public static get(): string {
		return config('app.url');
	}

}
