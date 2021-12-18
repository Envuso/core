import {HTTPMethods} from "fastify";
import {AllControllerMeta} from "../../../Routing/Controller/ControllerDecoratorBinding";
import {ControllerAndRoutes, StoredRouteInformation} from "../../../Routing/Route/Routing";
import {RouteContract} from "./RouteContract";

export interface RoutingContract {
	initiated: boolean;
	controllersAndRoutes: ControllerAndRoutes[];
	routes: { [key: string]: StoredRouteInformation };
	routeNamesToPathMap: { [key: string]: string };

	/**
	 * Load all of our registered controllers from the container
	 * Store their information in {@see controllersAndRoutes} + {@see routes}
	 *
	 * After this stage, they're ready to be bound to fastify at any point
	 *
	 * @private
	 */
	loadControllers(): void;

	/**
	 * Get the metadata the controller
	 * Tells us the target for Reflect and it's path
	 */
	getControllerMeta(controller: any): AllControllerMeta;

	/**
	 * Get the route from {@see routes} via it's name "TestingController.testMethod"
	 *
	 * @param {string} routeName
	 * @returns {StoredRouteInformation | null}
	 */
	getRouteByName(routeName: string): null | RouteContract;

	/**
	 * Get all of the registered controller information
	 *
	 * @returns {ControllerAndRoutes[]}
	 */
	getControllers(): ControllerAndRoutes[];

	/**
	 * Check if a route path has been registered
	 * Optionally check if a route path using x http method is registered.
	 *
	 * @param {string} path
	 * @param {HTTPMethods} method
	 * @returns {boolean}
	 */
	hasPathRegistered(path: string, method?: HTTPMethods): boolean;

	/**
	 * Get a route by it's path
	 *
	 * @param {string} path
	 * @returns {StoredRouteInformation | null}
	 */
	getRouteByPath(path: string): StoredRouteInformation | null;

	/**
	 * Get all of the registered routes
	 *
	 * @returns {{[p: string]: StoredRouteInformation}}
	 */
	getRoutes(): { [key: string]: StoredRouteInformation };

	isInitiated(): boolean;
}
