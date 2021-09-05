
import {Exception, StatusCodes} from "../../Common";

export class UnauthorisedException extends Exception {

	constructor(message?: string) {
		super(message ?? 'Unauthorised.', StatusCodes.UNAUTHORIZED);
	}

}
