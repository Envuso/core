"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationServiceProvider = void 0;
const tslib_1 = require("tslib");
const AppContainer_1 = require("../AppContainer");
const Authentication_1 = require("./Authentication");
class AuthenticationServiceProvider extends AppContainer_1.ServiceProvider {
    register(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            app.container().register(Authentication_1.Authentication, {
                useFactory: (container) => {
                    return new Authentication_1.Authentication(container.resolve(AppContainer_1.ConfigRepository));
                }
            });
            //		app.bind(() => {
            //			return new Authentication(config);
            //		}, Authentication);
        });
    }
    boot(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.AuthenticationServiceProvider = AuthenticationServiceProvider;
//# sourceMappingURL=AuthenticationServiceProvider.js.map