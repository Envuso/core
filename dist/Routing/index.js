"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = exports.response = exports.session = exports.context = void 0;
const RequestContext_1 = require("./Context/RequestContext");
__exportStar(require("./RouteServiceProvider"), exports);
__exportStar(require("./Context/Request/Request"), exports);
__exportStar(require("./Context/Request/UploadedFile"), exports);
__exportStar(require("./Context/Session"), exports);
__exportStar(require("./Context/CookieJar"), exports);
__exportStar(require("./Context/Response/Response"), exports);
__exportStar(require("./Context/RequestContext"), exports);
__exportStar(require("./Context/RequestContextStore"), exports);
__exportStar(require("./Context/RequestContext"), exports);
__exportStar(require("./Context/RequestContextStore"), exports);
__exportStar(require("./Controller/Controller"), exports);
__exportStar(require("./Controller/ControllerManager"), exports);
__exportStar(require("./Controller/ControllerDecorators"), exports);
__exportStar(require("./DataTransferObject/DataTransferObject"), exports);
__exportStar(require("./DataTransferObject/DtoValidationException"), exports);
__exportStar(require("./Middleware/Middleware"), exports);
__exportStar(require("./Middleware/MiddlewareDecorators"), exports);
__exportStar(require("./Route/RequestInjection/index"), exports);
__exportStar(require("./Route/Route"), exports);
__exportStar(require("./Route/RouteDecorators"), exports);
__exportStar(require("./Route/RouteManager"), exports);
__exportStar(require("./Middleware/Middlewares/JwtAuthenticationMiddleware"), exports);
const context = () => RequestContext_1.RequestContext.get();
exports.context = context;
const session = () => RequestContext_1.RequestContext.session();
exports.session = session;
const response = () => RequestContext_1.RequestContext.response();
exports.response = response;
function request(key, _default = null) {
    if (key)
        return RequestContext_1.RequestContext.request().get(key, _default);
    return RequestContext_1.RequestContext.request();
}
exports.request = request;
//export const request = (): Request => {
//	return RequestContext.request() as Request;
//};
//export const request = <T>(key?: string, _default = null): T => {
//	return RequestContext.request().get<T>(key, _default);
//};
//# sourceMappingURL=index.js.map