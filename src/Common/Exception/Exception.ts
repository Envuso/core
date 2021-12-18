import {StatusCodes} from "../Http";

export class Exception extends Error {

	public response: any     = {};
	public code: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR;

	constructor(message: string, code?: StatusCodes) {
		super(message);

		if (code)
			this.code = code;

		this.response = {
			message : this.message,
			code    : code,
		};
	}

	public handleViewResponse():object {
		return {};
	}

	public handleJsonResponse():object {
		return {};
	}

	public handleLoggerResponse():object {
		return {};
	}

}
