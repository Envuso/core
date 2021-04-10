"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
class Request {
    constructor(request) {
        this._request = request;
    }
    get fastifyRequest() {
        return this._request;
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map