"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelNotFoundException = void 0;
const http_status_codes_1 = require("http-status-codes");
const Common_1 = require("../../Common");
class ModelNotFoundException extends Common_1.Exception {
    constructor(entityName) {
        super(`Model(${entityName}} cannot be found.`);
        this.code = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
exports.ModelNotFoundException = ModelNotFoundException;
//# sourceMappingURL=ModelNotFoundException.js.map