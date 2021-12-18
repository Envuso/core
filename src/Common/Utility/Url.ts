import {config} from "../../AppContainer";
import {UrlGenerator} from "../../Routing/Route/UrlGenerator";

export class Url {

	public static generator(): UrlGenerator {
		return new UrlGenerator();
	}

	/**
	 * Generate a url for a controller method
	 *
	 * @param {T} controllerAndMethod
	 * @param attributes
	 * @returns {string | null}
	 */
	public static routeUrl<T extends string>(controllerAndMethod: T, attributes?: any): string | null {
		return this.generator().generateUrlForRoute(controllerAndMethod, attributes);
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
