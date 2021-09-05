import {Exception, StatusCodes} from "../../Common";

export class DtoValidationException extends Exception {

	private _validationErrors: { [key: string]: string };

	constructor(validationErrors: { [key: string]: string }) {
		super('Failed to validate input');
		this.code = StatusCodes.UNPROCESSABLE_ENTITY;
		this._validationErrors = validationErrors;
	}

	public handleJsonResponse(): object {
		return this._validationErrors;
	}

}
