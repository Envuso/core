import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class DtoValidationException extends Exception {

	private _validationErrors: { [key: string]: string };

	constructor(validationErrors: { [key: string]: string }) {
		super('Failed to validate input');
		this.code              = StatusCodes.UNPROCESSABLE_ENTITY;
		this._validationErrors = validationErrors;
	}

	public handleJsonResponse(): object {
		return this._validationErrors;
	}

	public getValidationErrors() {
		return this._validationErrors;
	}

}
