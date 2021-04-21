"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.app = exports.resolve = exports.inject = exports.scoped = exports.singleton = exports.autoInjectable = exports.injectable = void 0;
const tslib_1 = require("tslib");
const App_1 = require("./App");
tslib_1.__exportStar(require("./App"), exports);
tslib_1.__exportStar(require("./ServiceProvider"), exports);
tslib_1.__exportStar(require("./Config/ConfigRepository"), exports);
tslib_1.__exportStar(require("./Exceptions/FailedToBindException"), exports);
var tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "injectable", { enumerable: true, get: function () { return tsyringe_1.injectable; } });
Object.defineProperty(exports, "autoInjectable", { enumerable: true, get: function () { return tsyringe_1.autoInjectable; } });
Object.defineProperty(exports, "singleton", { enumerable: true, get: function () { return tsyringe_1.singleton; } });
Object.defineProperty(exports, "scoped", { enumerable: true, get: function () { return tsyringe_1.scoped; } });
Object.defineProperty(exports, "inject", { enumerable: true, get: function () { return tsyringe_1.inject; } });
// Helper methods to resolve from the container a little easier/cleaner
const resolve = (identifier) => App_1.App.getInstance().resolve(identifier);
exports.resolve = resolve;
const app = () => App_1.App.getInstance();
exports.app = app;
const config = (key, _default = null) => {
    if (key)
        return App_1.App.getInstance().config().get(key, _default);
    return App_1.App.getInstance().config();
};
exports.config = config;
//# sourceMappingURL=index.js.map