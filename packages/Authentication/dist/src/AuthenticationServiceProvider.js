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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationServiceProvider = void 0;
const app_1 = require("@envuso/app");
const Authentication_1 = require("./Authentication");
class AuthenticationServiceProvider extends app_1.ServiceProvider {
    register(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            app.container().register(Authentication_1.Authentication, {
                useFactory: (container) => {
                    return new Authentication_1.Authentication(container.resolve(app_1.ConfigRepository));
                }
            });
            //		app.bind(() => {
            //			return new Authentication(config);
            //		}, Authentication);
        });
    }
    boot(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.AuthenticationServiceProvider = AuthenticationServiceProvider;
//# sourceMappingURL=AuthenticationServiceProvider.js.map