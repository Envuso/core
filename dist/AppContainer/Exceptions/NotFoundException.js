"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const http_status_codes_1 = require("http-status-codes");
const Common_1 = require("../../Common");
class NotFoundException extends Common_1.Exception {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : 'Not found.', http_status_codes_1.StatusCodes.NOT_FOUND);
    }
}
exports.NotFoundException = NotFoundException;
//# sourceMappingURL=NotFoundException.js.map