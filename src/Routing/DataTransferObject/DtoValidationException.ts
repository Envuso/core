import {ValidationError} from "class-validator";

export class DtoValidationException extends Error {
	private _validationErrors: ValidationError[];

	constructor(validationErrors: ValidationError[]) {
		super('Failed to validate class properties');

		this._validationErrors = validationErrors;
	}

}
