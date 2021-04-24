"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const http_status_codes_1 = require("http-status-codes");
const CookieJar_1 = require("../CookieJar");
class Response {
    constructor(response) {
        this._response = response;
        this._cookieJar = new CookieJar_1.CookieJar();
    }
    get fastifyReply() {
        return this._response;
    }
    cookieJar() {
        return this._cookieJar;
    }
    set code(code) {
        this._code = code;
    }
    set data(data) {
        this._data = data;
    }
    get code() {
        var _a;
        return (_a = this._code) !== null && _a !== void 0 ? _a : 200;
    }
    get data() {
        var _a;
        return (_a = this._data) !== null && _a !== void 0 ? _a : {};
    }
    /**
     * Do we have x header set on the response?
     *
     * @param {string} header
     * @returns {boolean}
     */
    hasHeader(header) {
        return this.fastifyReply.hasHeader(header);
    }
    /**
     * Get x header from the response
     *
     * @param {string} header
     * @returns {string}
     */
    getHeader(header) {
        return this.fastifyReply.getHeader(header);
    }
    /**
     * Apply a header to the response, this applies directly to the fastify response
     *
     * @param header
     * @param value
     */
    header(header, value) {
        this.fastifyReply.header(header, value);
        return this;
    }
    /**
     * Set the data & status code to return
     *
     * @param data
     * @param code
     */
    setResponse(data, code) {
        this._data = data;
        this._code = code;
        return this;
    }
    /**
     * Set the status code... can be chained with other methods.
     *
     * @param code
     */
    setCode(code) {
        this._code = code;
        return this;
    }
    /**
     * Send the data/status code manually
     */
    send() {
        return this.fastifyReply
            .status(this.code)
            .send(this.data);
    }
    /**
     * Send a redirect response to x url
     *
     * @param url
     */
    redirect(url) {
        return this
            .setResponse(null, http_status_codes_1.StatusCodes.TEMPORARY_REDIRECT)
            .header('Location', url);
    }
    /**
     * Send a not found response
     *
     * @param data
     */
    notFound(data) {
        return this.setResponse(data, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    /**
     * Send a bad request response
     *
     * @param data
     */
    badRequest(data) {
        return this.setResponse(data, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    //	/**
    //	 * Send a validation failure response
    //	 * NOTE: This will throw a {@see ValidationException}, just to keep things structured.
    //	 * @param data
    //	 */
    //	validationFailure(data?: any) {
    //		throw new ValidationException(data);
    ////		return this.setResponse(data, StatusCodes.UNPROCESSABLE_ENTITY);
    //	}
    /**
     * Return json data
     *
     * @param data
     * @param code
     */
    json(data, code) {
        return this.setResponse(data || {}, code || http_status_codes_1.StatusCodes.ACCEPTED);
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map