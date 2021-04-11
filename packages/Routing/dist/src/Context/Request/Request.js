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
    /**
     * Get the value of a header from the request
     *
     * @param header
     * @param _default
     */
    header(header, _default = null) {
        var _a;
        return (_a = this._request.headers[header]) !== null && _a !== void 0 ? _a : _default;
    }
    /**
     * Get all of the headers from the request
     */
    headers() {
        return this._request.headers;
    }
    /**
     * Get the body of the request
     */
    body() {
        return this._request.body;
    }
    /**
     * Get the ip the request originated from
     */
    ip() {
        return this._request.ip;
    }
    /**
     * an array of the IP addresses, ordered from closest to furthest,
     * in the X-Forwarded-For header of the incoming request
     * (only when the trustProxy option is enabled)
     *
     * @see https://www.fastify.io/docs/latest/Request/
     */
    ips() {
        return this._request.ips;
    }
    /**
     * The full url of the incoming request
     */
    url() {
        return this._request.url;
    }
    /**
     * The method of the incoming request, GET, PUT etc
     */
    method() {
        return this._request.method;
    }
    /**
     * The id assigned to this request
     */
    id() {
        return this._request.id;
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map