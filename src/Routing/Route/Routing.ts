import {HTTPMethods} from "fastify";
import {App} from "../../AppContainer";
import {Log, METADATA} from "../../Common";
import {ControllerContract} from "../../Contracts/Routing/Controller/ControllerContract";
import {RouteContract} from "../../Contracts/Routing/Route/RouteContract";
import {RoutingContract} from "../../Contracts/Routing/Route/RoutingContract";
import {AllControllerMeta} from "../Controller/ControllerDecoratorBinding";
import {Route} from "./Route";

let instance: Routing = null;

export interface ControllerAndRoutes {
	controller: new () => ControllerContract;
	controllerName: string;
	routes: RouteContract[];
}

export type StoredRouteInformation = {
	DELETE?: RouteContract,
	GET?: RouteContract,
	HEAD?: RouteContract,
	PATCH?: RouteContract,
	POST?: RouteContract,
	PUT?: RouteContract,
	OPTIONS?: RouteContract,
};


export class Routing implements RoutingContract {

	/**
	 * Has an instance of this class been initiated yet?
	 *
	 * @type {boolean}
	 * @private
	 */
	public initiated: boolean = false;

	/**
	 * All of the stored controllers + routes with their meta
	 *
	 * @type {ControllerAndRoutes[]}
	 * @private
	 */
	public controllersAndRoutes: ControllerAndRoutes[] = [];

	/**
	 * All of the stored routes, keyed by their paths
	 *
	 * @type {{[p: string]: StoredRouteInformation}}
	 * @private
	 */
	public routes: { [key: string]: StoredRouteInformation } = {};

	/**
	 * We'll store an object of controller.routeMethod names to path
	 *
	 * This is so we can easily map a route name to a route without iteration.
	 *
	 * I don't know if this is bad to be storing so much information on routes but eh.
	 *
	 * @type {{[p: string]: string}}
	 * @private
	 */
	public routeNamesToPathMap: { [key: string]: string } = {};

	/**
	 * Get the instance of this class
	 *
	 * @returns {Routing}
	 */
	public static get(): RoutingContract {
		if (instance) return instance;

		instance = new Routing();

		return instance;
	}

	/**
	 * Load all of the controllers + path if they haven't been loaded yet
	 * Set the static instance of this class, then return it.
	 *
	 * @returns {Routing}
	 */
	public static initiate(): RoutingContract {
		const instance = this.get();

		if (!instance.isInitiated()) {
			instance.loadControllers();
		}

		return instance;
	}

	/**
	 * Load all of our registered controllers from the container
	 * Store their information in {@see controllersAndRoutes} + {@see routes}
	 *
	 * After this stage, they're ready to be bound to fastify at any point
	 *
	 * @private
	 */
	public loadControllers() {
		this.controllersAndRoutes = [];

		const controllers = App.getInstance().container().resolveAll<new () => ControllerContract>('Controllers');

		for (let controller of controllers) {
			const meta = this.getControllerMeta(controller);

			if (!meta?.controller && !meta?.methods) {
				throw Error('Controller somehow has no meta defined... ' + controller.constructor.name);
			}

			const controllerAndRoutes = {
				controller     : controller,
				controllerName : controller.name,
				routes         : meta.methods.map(method => new Route(meta, method))
			};

			// We'll store an array of all the Controller + it's routes
			this.controllersAndRoutes.push(controllerAndRoutes);

			// We'll then store a key -> value version of
			// Route paths and their respective route
			// This will allow us to get information about a route without much iteration
			for (let route of controllerAndRoutes.routes) {

				if (!this.routes[route.getPath()]) {
					this.routes[route.getPath()] = {};
				}

				for (let method of route.getMethods()) {

					if (!this.routeNamesToPathMap[route.getName()]) {
						this.routeNamesToPathMap[route.getName()] = route.getPath();
					}

					if (this.routes[route.getPath()][method]) {
						Log.warn("It looks like we might have a route clash of some kind.");
						Log.warn(`Controller name+method: ${controllerAndRoutes.controllerName}.${route.methodMeta.key}, Route path: ${route.getPath()}, http method: ${method}`);
						continue;
					}

					this.routes[route.getPath()][method] = route;
				}

			}

		}
	}

	/**
	 * Get the metadata the controller
	 * Tells us the target for Reflect and it's path
	 */
	public getControllerMeta(controller: any): AllControllerMeta {
		return {
			controller : Reflect.getMetadata(METADATA.CONTROLLER, controller),
			methods    : Reflect.getMetadata(METADATA.CONTROLLER_METHODS, controller)
		};
	}

	/**
	 * Get the route from {@see routes} via it's name "TestingController.testMethod"
	 *
	 * @param {string} routeName
	 * @returns {StoredRouteInformation | null}
	 */
	public getRouteByName(routeName: string): null | RouteContract {
		const routeNameParts = routeName.split('.');

		if (routeNameParts.length !== 2) {
			Log.error('Trying to get route by name(Routing.get().getRouteByName()) but route name should follow the format {ControllerName}.{MethodName}');
			return null;
		}

		const routePath = this.routeNamesToPathMap[routeName];

		if (!routePath) {
			return null;
		}

		const route = this.routes[routePath] ?? null;

		if (!route) {
			return null;
		}

		return Object.values(route).find(r => r.getMethod() === routeNameParts[1]);
	}

	/**
	 * Get all of the registered controller information
	 *
	 * @returns {ControllerAndRoutes[]}
	 */
	public getControllers(): ControllerAndRoutes[] {
		return this.controllersAndRoutes;
	}

	/**
	 * Check if a route path has been registered
	 * Optionally check if a route path using x http method is registered.
	 *
	 * @param {string} path
	 * @param {HTTPMethods} method
	 * @returns {boolean}
	 */
	public hasPathRegistered(path: string, method?: HTTPMethods): boolean {
		const route = this.routes[path] ?? undefined;

		if (method) {
			return route![method] !== undefined;
		}

		return route !== undefined;
	}

	/**
	 * Get a route by it's path
	 *
	 * @param {string} path
	 * @returns {StoredRouteInformation | null}
	 */
	public getRouteByPath(path: string): StoredRouteInformation | null {
		return this.routes[path] ?? null;
	}

	/**
	 * Get all of the registered routes
	 *
	 * @returns {{[p: string]: StoredRouteInformation}}
	 */
	public getRoutes(): { [key: string]: StoredRouteInformation } {
		return this.routes;
	}

	public isInitiated() {
		return this.initiated === true;
	}

}
