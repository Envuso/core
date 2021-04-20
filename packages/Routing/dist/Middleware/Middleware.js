"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const common_1 = require("@envuso/common");
class Middleware {
    static getMetadata(controller) {
        return Reflect.getMetadata(common_1.METADATA.MIDDLEWARE, controller);
    }
    static setMetadata(controller, middlewares) {
        return Reflect.defineMetadata(common_1.METADATA.MIDDLEWARE, { middlewares }, controller);
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map