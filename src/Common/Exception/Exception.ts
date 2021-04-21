import {StatusCodes} from "http-status-codes";

export class Exception extends Error {

	public response: any     = {};
	public code: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR;

	constructor(message: string, code?: StatusCodes) {
		super(message);

		if (code)
			this.code = code;

		this.response = {
			message : this.message
		}
	}

}
