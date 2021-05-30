"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyNotFound = void 0;
const http_status_codes_1 = require("http-status-codes");
const Common_1 = require("../../Common");
class PolicyNotFound extends Common_1.Exception {
    constructor(entityName) {
        super(`Model(${entityName}) does not have a policy assigned.`);
        this.code = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
exports.PolicyNotFound = PolicyNotFound;
//# sourceMappingURL=PolicyNotFound.js.map