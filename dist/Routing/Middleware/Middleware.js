"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const Common_1 = require("../../Common");
class Middleware {
    static getMetadata(controller) {
        return Reflect.getMetadata(Common_1.METADATA.MIDDLEWARE, controller);
    }
    static setMetadata(controller, middlewares) {
        return Reflect.defineMetadata(Common_1.METADATA.MIDDLEWARE, { middlewares }, controller);
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map