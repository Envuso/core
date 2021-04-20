import { ValidationError } from "class-validator";
export declare class DtoValidationException extends Error {
    private _validationErrors;
    constructor(validationErrors: ValidationError[]);
}
