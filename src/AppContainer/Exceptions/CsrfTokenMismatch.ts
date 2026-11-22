
import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class CsrfTokenMismatch extends Exception {

	constructor(message?: string) {
		super(message ?? 'Csrf token is invalid', StatusCodes.FORBIDDEN);
	}

}
