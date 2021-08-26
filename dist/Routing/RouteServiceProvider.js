"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteServiceProvider = void 0;
const path_1 = __importDefault(require("path"));
const ServiceProvider_1 = require("../AppContainer/ServiceProvider");
const AppContainer_1 = require("../AppContainer");
const Common_1 = require("../Common");
class RouteServiceProvider extends ServiceProvider_1.ServiceProvider {
    register(app) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    boot(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
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