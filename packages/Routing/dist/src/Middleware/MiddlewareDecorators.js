"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const Middleware_1 = require("./Middleware");
function middleware(middleware) {
    return function (target, propertyKey, descriptor) {
        const middlewares = [];
        const meta = Middleware_1.Middleware.getMetadata(target);
        if (meta === null || meta === void 0 ? void 0 : meta.middlewares) {
            middlewares.push(...meta.middlewares);
        }
        middlewares.push(middleware);
        let bindTarget = descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
        if (!bindTarget) {
            bindTarget = target;
        }
        Middleware_1.Middleware.setMetadata(bindTarget, middlewares);
    };
}
exports.middleware = middleware;
//# sourceMappingURL=MiddlewareDecorators.js.map