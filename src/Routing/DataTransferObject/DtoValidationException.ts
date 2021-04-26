import {ValidationError} from "class-validator";
import {Exception} from "../../Common";

export class DtoValidationException extends Exception {
	private _validationErrors: ValidationError[];

	constructor(validationErrors: ValidationError[]) {
		super('Failed to validate class properties');

		this._validationErrors = validationErrors;

		const validationErrorsFormatted = {};
		for (let validationError of this._validationErrors) {
			validationErrorsFormatted[validationError.property] = Object.values(validationError.constraints)[0] || null;
		}

		this.response = {
			message : this.message,
			errors  : validationErrorsFormatted
		};
	}

}
