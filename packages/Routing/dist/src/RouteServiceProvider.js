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
const app_1 = require("@envuso/app");
const common_1 = require("@envuso/common");
const Log_1 = require("@envuso/common/dist/src/Logger/Log");
const path_1 = __importDefault(require("path"));
class RouteServiceProvider extends app_1.ServiceProvider {
    register(app) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    boot(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = yield common_1.FileLoader.importModulesFrom(path_1.default.join(config.get('paths.controllers'), '**', '*.ts'));
            for (let controller of controllers) {
                if (app.container().isRegistered(controller.instance)) {
                    throw new Error('You can not register the same controller more than once. Controller(' + controller.name + ') path: ' + controller.originalPath);
                }
                app.bind(() => {
                    return new controller.instance();
                }, 'Controllers');
                Log_1.Log.info('Imported controller: ' + controller.name);
            }
        });
    }
    /**
     * Get all controllers from the container
     */
    getAllControllers() {
        return app_1.App.getInstance().container().resolveAll('Controllers');
    }
}
exports.RouteServiceProvider = RouteServiceProvider;
//# sourceMappingURL=RouteServiceProvider.js.map