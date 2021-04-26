import {ValidationError} from "class-validator";
import {Exception} from "../../Common";

export class DtoValidationException extends Exception {
	private _validationErrors: ValidationError[];

	constructor(validationErrors: ValidationError[]) {
		super('Failed to validate class properties');

		this._validationErrors = validationErrors;

		this.response = {
			message : this.message,
			errors  : this._validationErrors
		};
	}

}
