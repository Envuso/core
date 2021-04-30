"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorisedException = void 0;
const http_status_codes_1 = require("http-status-codes");
const Common_1 = require("../../Common");
class UnauthorisedException extends Common_1.Exception {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : 'Unauthorised.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
}
exports.UnauthorisedException = UnauthorisedException;
//# sourceMappingURL=UnauthorisedException.js.map