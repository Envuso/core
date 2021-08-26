"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidObjectIdUsed = void 0;
const http_status_codes_1 = require("http-status-codes");
const Common_1 = require("../../Common");
class InvalidObjectIdUsed extends Common_1.Exception {
    constructor(entityName) {
        super(`Model(${entityName}} cannot be loaded with an invalid object id`);
        this.code = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
}
exports.InvalidObjectIdUsed = InvalidObjectIdUsed;
//# sourceMappingURL=InvalidObjectIdUsed.js.map