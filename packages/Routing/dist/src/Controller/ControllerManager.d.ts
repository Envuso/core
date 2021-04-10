import { Route } from "../Route/Route";
import { Controller } from "./Controller";
export interface ControllerAndRoutes {
    controller: Controller;
    routes: Route[];
}
export declare class ControllerManager {
    /**
     * Store the metadata for this controller instance on Reflect
     * so we can access the path registered for it, anywhere.
     *
     * @param path
     */
    static bindControllerMeta(path: any): (target: any) => void;
    /**
     * Pull all controllers from the container
     * and setup the route instances for them
     */
    static initiateControllers(): ControllerAndRoutes[];
    /**
     * Return an array of routes for the specified Controller
     *
     * @param controller
     * @private
     */
    static getRoutesForController(controller: Controller): Route[];
}
