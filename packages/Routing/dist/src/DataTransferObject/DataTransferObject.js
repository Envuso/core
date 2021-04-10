"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransferObject = void 0;
const Log_1 = require("@envuso/common/dist/src/Logger/Log");
const class_validator_1 = require("class-validator");
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield class_validator_1.validateOrReject(this, {
                    forbidUnknownValues: true,
                    whitelist: true,
                    enableDebugMessages: true,
                });
            }
            catch (error) {
                Log_1.Log.warn(error);
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