"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerManager = void 0;
const app_1 = require("@envuso/app");
const common_1 = require("@envuso/common");
const Route_1 = require("../Route/Route");
const RouteServiceProvider_1 = require("../RouteServiceProvider");
class ControllerManager {
    /**
     * Store the metadata for this controller instance on Reflect
     * so we can access the path registered for it, anywhere.
     *
     * @param path
     */
    static bindControllerMeta(path) {
        return function (target) {
            var _a;
            const currentMetadata = {
                path: path,
                target: target,
                injectionParams: (_a = common_1.DecoratorHelpers.paramTypes(target)) !== null && _a !== void 0 ? _a : []
            };
            //			autoInjectable()(target);
            //			injectable()(target);
            //const params = DecoratorHelpers.paramTypes(target);
            Reflect.defineMetadata(common_1.METADATA.CONTROLLER, currentMetadata, target);
            const previousMetadata = Reflect.getMetadata(common_1.METADATA.CONTROLLER, Reflect) || [];
            const newMetadata = [currentMetadata, ...previousMetadata];
            Reflect.defineMetadata(common_1.METADATA.CONTROLLER, newMetadata, Reflect);
        };
    }
    /**
     * Pull all controllers from the container
     * and setup the route instances for them
     */
    static initiateControllers() {
        const controllers = app_1.App.getInstance()
            .resolve(RouteServiceProvider_1.RouteServiceProvider)
            .getAllControllers();
        const routes = [];
        for (let controller of controllers) {
            routes.push({
                controller: controller,
                routes: this.getRoutesForController(controller)
            });
        }
        return routes;
    }
    /**
     * Return an array of routes for the specified Controller
     *
     * @param controller
     * @private
     */
    static getRoutesForController(controller) {
        const meta = controller.getMeta();
        if (!(meta === null || meta === void 0 ? void 0 : meta.controller) && !(meta === null || meta === void 0 ? void 0 : meta.methods)) {
            throw Error('Controller somehow has no meta defined... ' + controller.constructor.name);
        }
        const routes = [];
        for (let methodKey in meta.methods) {
            const method = meta.methods[methodKey];
            routes.push(new Route_1.Route(meta, method));
        }
        return routes;
    }
}
exports.ControllerManager = ControllerManager;
//# sourceMappingURL=ControllerManager.js.map