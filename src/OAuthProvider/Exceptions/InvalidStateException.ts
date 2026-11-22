import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class InvalidStateException extends Exception {
	constructor() {
		super("Invalid state for oauth request", StatusCodes.BAD_REQUEST);
	}
}
