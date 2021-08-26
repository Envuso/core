"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
const http_status_codes_1 = require("http-status-codes");
class Exception extends Error {
    constructor(message, code) {
        super(message);
        this.response = {};
        this.code = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
        if (code)
            this.code = code;
        this.response = {
            message: this.message
        };
    }
}
exports.Exception = Exception;
//# sourceMappingURL=Exception.js.map