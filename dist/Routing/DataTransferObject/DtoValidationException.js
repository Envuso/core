"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DtoValidationException = void 0;
const Common_1 = require("../../Common");
class DtoValidationException extends Common_1.Exception {
    constructor(validationErrors) {
        super('Failed to validate class properties');
        this._validationErrors = validationErrors;
        const validationErrorsFormatted = {};
        for (let validationError of this._validationErrors) {
            validationErrorsFormatted[validationError.property] = Object.values(validationError.constraints)[0] || null;
        }
        this.response = {
            message: this.message,
            errors: validationErrorsFormatted
        };
    }
}
exports.DtoValidationException = DtoValidationException;
//# sourceMappingURL=DtoValidationException.js.map