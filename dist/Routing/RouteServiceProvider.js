"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteServiceProvider = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const AppContainer_1 = require("../AppContainer");
const Common_1 = require("../Common");
class RouteServiceProvider extends AppContainer_1.ServiceProvider {
    register(app) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    boot(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const controllers = yield Common_1.FileLoader.importModulesFrom(path_1.default.join(config.get('paths.controllers'), '**', '*.ts'));
            for (let controller of controllers) {
                if (app.container().isRegistered(controller.instance)) {
                    throw new Error('You can not register the same controller more than once. Controller(' + controller.name + ') path: ' + controller.originalPath);
                }
                app.bind(() => {
                    return controller.instance;
                }, 'Controllers');
                //			app.container().register(controller.instance.prototype, {useValue : controller.instance});
                Common_1.Log.info('Imported controller: ' + controller.name);
            }
        });
    }
    /**
     * Get all controllers from the container
     */
    getAllControllers() {
        return AppContainer_1.App.getInstance().container().resolveAll('Controllers');
    }
}
exports.RouteServiceProvider = RouteServiceProvider;
//# sourceMappingURL=RouteServiceProvider.js.map