import {injectable} from "tsyringe";
import {App} from "../../AppContainer";
import {DecoratorHelpers} from "../../Common/Decorators/DecoratorHelpers";
import {METADATA} from "../../Common/Decorators/RoutingMetaData";
import {Route} from "../Route/Route";
import {RouteServiceProvider} from "../RouteServiceProvider";
import {Controller} from "./Controller";
import {AllControllerMeta, ControllerMetadata} from "./ControllerDecorators";

export interface ControllerAndRoutes {
	controller: Controller;
	routes: Route[];
}

export class ControllerManager {

	/**
	 * Store the metadata for this controller instance on Reflect
	 * so we can access the path registered for it, anywhere.
	 *
	 * @param path
	 */
	public static bindControllerMeta(path) {
		return function (target: any) {
			const currentMetadata: ControllerMetadata = {
				path            : path,
				target          : target,
				injectionParams : DecoratorHelpers.paramTypes(target) ?? []
			};

//			autoInjectable()(target);
			injectable()(target);
			//const params = DecoratorHelpers.paramTypes(target);
			Reflect.defineMetadata(METADATA.CONTROLLER, currentMetadata, target);


			const previousMetadata: ControllerMetadata[] = Reflect.getMetadata(
				METADATA.CONTROLLER,
				Reflect
			) || [];

			const newMetadata = [currentMetadata, ...previousMetadata];

			Reflect.defineMetadata(
				METADATA.CONTROLLER,
				newMetadata,
				Reflect
			);
		};
	}

	/**
	 * Pull all controllers from the container
	 * and setup the route instances for them
	 */
	static initiateControllers() {
		const controllers = App.getInstance()
			.resolve(RouteServiceProvider)
			.getAllControllers();

		const routes: ControllerAndRoutes[] = [];

		for (let controller of controllers) {
			routes.push({
				controller : controller,
				routes     : this.getRoutesForController(controller)
			});
		}

		return routes;
	}

	/**
	 * Get the metadata the controller
	 * Tells us the target for Reflect and it's path
	 */
	static getMeta(controller : any): AllControllerMeta {
		return {
			controller : Reflect.getMetadata(METADATA.CONTROLLER, controller),
			methods    : Reflect.getMetadata(METADATA.CONTROLLER_METHODS, controller)
		}
	}

	/**
	 * Return an array of routes for the specified Controller
	 *
	 * @param controller
	 * @private
	 */
	static getRoutesForController(controller: Controller) {
		const meta = this.getMeta(controller);

		if (!meta?.controller && !meta?.methods) {
			throw Error('Controller somehow has no meta defined... ' + controller.constructor.name);
		}

		const routes: Route[] = [];

		for (let methodKey in meta.methods) {
			const method = meta.methods[methodKey];

			routes.push(new Route(meta, method));
		}

		return routes;
	}
}
