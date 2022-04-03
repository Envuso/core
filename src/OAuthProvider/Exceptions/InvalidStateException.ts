import {Exception, StatusCodes} from "../../Common";

export class InvalidStateException extends Exception {
	constructor() {
		super("Invalid state for oauth request", StatusCodes.BAD_REQUEST);
	}
}
