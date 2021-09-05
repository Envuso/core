import qs from "querystring";
import {Model} from "../../Database";
import {ApplicationRouteAttributeObject} from "../../Meta/ApplicationRouteMeta";
import {getApplicationRoute} from "../../Meta/ApplicationRouteHelpers";

export class RouteHelper {


	public static urlFor<T extends keyof ApplicationRouteAttributeObject>(
		routeStr: T, attributes?: ApplicationRouteAttributeObject[T] | any
	): string {
		const internalRoute = getApplicationRoute(routeStr);

		let routePath = internalRoute.path;

		for (let parameterKey in internalRoute.parameters) {
			if (routePath.includes(`:${parameterKey}`)) {
				routePath = routePath.replace(`:${parameterKey}`, attributes[parameterKey]);
				delete attributes[parameterKey];
			}
		}

		let queryAttributes = {};

		for (let attributeKey in attributes) {
			let attr = attributes[attributeKey];

			if (attr instanceof Model) {
				attr = attr.getModelId().toHexString();
			}

			queryAttributes[attributeKey] = attr;
		}


		let finalUrl = routePath;
		if (Object.keys(queryAttributes).length) {
			finalUrl += '?';
		}
		finalUrl += qs.stringify(queryAttributes);

		return finalUrl;
	}

}
