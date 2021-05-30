"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyPermissionNotFound = void 0;
const http_status_codes_1 = require("http-status-codes");
const Common_1 = require("../../Common");
class PolicyPermissionNotFound extends Common_1.Exception {
    constructor(entityName, permissionName) {
        super(`Model(${entityName}} does not have a method named: ${permissionName}`);
        this.code = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
exports.PolicyPermissionNotFound = PolicyPermissionNotFound;
//# sourceMappingURL=PolicyPermissionNotFound.js.map