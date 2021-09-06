//import qs from "querystring";
//import {Model} from "../../Database";
//import {ApplicationRouteAttributeObject} from "../../Meta/ApplicationRouteMeta";
//import {getApplicationRoute} from "../../Meta/ApplicationRouteHelpers";
import {ControllerManager} from "../../Routing";

export class RouteHelper {

	public static urlFor<T extends string>(routeStr: T, attributes?: any): string {
//		const internalRoute = getApplicationRoute(routeStr);

//		let routePath = internalRoute.path;

//		for (let parameterKey in internalRoute.parameters) {
//			if (routePath.includes(`:${parameterKey}`)) {
//				routePath = routePath.replace(`:${parameterKey}`, attributes[parameterKey]);
//				delete attributes[parameterKey];
//			}
//		}

//		let queryAttributes = {};

//		for (let attributeKey in attributes) {
//			let attr = attributes[attributeKey];
//
//			if (attr instanceof Model) {
//				attr = attr.getModelId().toHexString();
//			}
//
//			queryAttributes[attributeKey] = attr;
//		}


//		let finalUrl = routePath;
//		if (Object.keys(queryAttributes).length) {
//			finalUrl += '?';
//		}
//		finalUrl += qs.stringify(queryAttributes);

		return ControllerManager.routesList[routeStr];
	}

}
