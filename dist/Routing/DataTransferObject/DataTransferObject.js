"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransferObject = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const Common_1 = require("../../Common");
const DtoValidationException_1 = require("./DtoValidationException");
class DataTransferObject {
    constructor() {
        /**
         * Validation errors returned by class-validator
         *
         * @private
         */
        this._validationErrors = [];
    }
    /**
     * Validate the data transfer object using class-validator
     */
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield class_validator_1.validateOrReject(this, {
                    forbidUnknownValues: true,
                    whitelist: true,
                    enableDebugMessages: true,
                });
            }
            catch (error) {
                Common_1.Log.warn(error);
                if (Array.isArray(error)) {
                    this._validationErrors = error;
                }
            }
        });
    }
    /**
     * If you didn't use auto validation, then you can
     * call this method to throw the validation error
     */
    throwIfFailed() {
        if (this.failed()) {
            throw new DtoValidationException_1.DtoValidationException(this._validationErrors);
        }
    }
    /**
     * Did the validation fail?
     */
    failed() {
        var _a;
        return !!((_a = this._validationErrors) === null || _a === void 0 ? void 0 : _a.length);
    }
    /**
     * Get the class-validator errors
     */
    errors() {
        return this._validationErrors || [];
    }
}
exports.DataTransferObject = DataTransferObject;
//# sourceMappingURL=DataTransferObject.js.map