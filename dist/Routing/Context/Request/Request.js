"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const tslib_1 = require("tslib");
const Storage_1 = require("../../../Storage");
const UploadedFile_1 = require("./UploadedFile");
class Request {
    constructor(request) {
        /**
         * If this request contains files that have been uploaded
         *
         * Then we will store some information about them here.
         * At this stage, they have been semi-processed and are
         * ready to be accessed without async code
         *
         * @private
         */
        this._uploadedFiles = [];
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
    /**
     * Get a value from the request body
     *
     * @param key
     * @param _default
     */
    get(key, _default = null) {
        var _a;
        return (_a = this._request.body[key]) !== null && _a !== void 0 ? _a : _default;
    }
    /**
     * Set file information that has been processed and is
     * ready to upload/stream to s3 etc
     *
     * @param file
     */
    setUploadedFile(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tempFileName = yield Storage_1.Storage.saveTemporaryFile(file.filename, file.file);
            this._uploadedFiles.push(new UploadedFile_1.UploadedFile(file, tempFileName));
        });
    }
    /**
     * Does the request contain any files?
     */
    hasFiles() {
        return !!this._uploadedFiles.length;
    }
    /**
     * Get all files on the request
     */
    files() {
        return this._uploadedFiles;
    }
    /**
     * Get a singular file on the request
     *
     * @param key
     */
    file(key) {
        var _a;
        if (!this.hasFiles())
            return null;
        return (_a = this._uploadedFiles.find(f => f.getFieldName() === key)) !== null && _a !== void 0 ? _a : null;
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map