"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path_1 = __importDefault(require("path"));
class RouteServiceProvider extends app_1.ServiceProvider {
    register(app) {
        return __awaiter(this, void 0, void 0, function* () {
            //		app.bind(() => {
            //			return new RouteServiceProvider();
            //		});
        });
    }
    boot(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = common_1.loadModulesFromPath(path_1.default.join(config.get('paths.controllers'), '**', '*.ts'));
            //		const controllers = await glob.sync(
            //			path.join(config.get('paths.controllers'), '**', '*.ts'),
            //			{follow : true}
            //		)
            for (let controllerPath of controllers) {
                yield this.bindController(app, controllerPath);
            }
        });
    }
    /**
     * Bind a controller to the container so it's initiated
     * and ready to accept a request when ever one comes in.
     *
     * @param app
     * @param controllerPath
     */
    bindController(app, controllerPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield Promise.resolve().then(() => __importStar(require(controllerPath)));
                const { instance, name } = common_1.classAndNameFromModule(module);
                //			const moduleName = Object.keys(module).shift() || null;
                //
                //			if (!moduleName) {
                //				throw new Error('Cannot get module name from imported controller: ' + controllerPath);
                //			}
                //
                //			const controllerClass = module[moduleName];
                if (app.container().isRegistered(instance)) {
                    throw new Error('You can not register the same controller more than once. Controller(' + name + ') path: ' + controllerPath);
                }
                app.bind(() => {
                    return new instance();
                }, 'Controllers');
            }
            catch (error) {
                console.error('Failed to load controller: ' + controllerPath, error);
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