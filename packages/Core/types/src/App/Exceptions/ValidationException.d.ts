import { ValidationError } from "class-validator";
import { Exception } from "./Exception";
export declare class ValidationException extends Exception {
    private errors;
    constructor(errors: Array<ValidationError> | {
        [key: string]: string;
    });
    static message(message: any): ValidationException;
    private processErrors;
}
