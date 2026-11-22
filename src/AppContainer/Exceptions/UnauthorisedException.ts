
import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class UnauthorisedException extends Exception {

	constructor(message?: string) {
		super(message ?? 'Unauthorised.', StatusCodes.UNAUTHORIZED);
	}

}
