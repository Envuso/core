
import {Exception, StatusCodes} from "../../Common";

export class CsrfTokenMismatch extends Exception {

	constructor(message?: string) {
		super(message ?? 'Csrf token is invalid', StatusCodes.FORBIDDEN);
	}

}
