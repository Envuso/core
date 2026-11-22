
import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class NotFoundException extends Exception {

	constructor(message?: string) {
		super(message ?? 'Not found.', StatusCodes.NOT_FOUND);
	}

}
