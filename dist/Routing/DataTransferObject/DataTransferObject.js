"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const class_transformer_1 = require("class-transformer");
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
        return __awaiter(this, void 0, void 0, function* () {
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
__decorate([
    class_transformer_1.Exclude(),
    __metadata("design:type", Array)
], DataTransferObject.prototype, "_validationErrors", void 0);
exports.DataTransferObject = DataTransferObject;
//# sourceMappingURL=DataTransferObject.js.map