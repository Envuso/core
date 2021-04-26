import { ValidationError } from "class-validator";
import { Exception } from "../../Common";
export declare class DtoValidationException extends Exception {
    private _validationErrors;
    constructor(validationErrors: ValidationError[]);
}
