"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DtoValidationException = void 0;
class DtoValidationException extends Error {
    constructor(validationErrors) {
        super('Failed to validate class properties');
        this._validationErrors = validationErrors;
    }
}
exports.DtoValidationException = DtoValidationException;
//# sourceMappingURL=DtoValidationException.js.map