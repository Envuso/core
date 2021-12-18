import {Exception, StatusCodes} from "../../Common";

export class FileDoesNotExistException extends Exception {
	constructor(path: string) {
		super(`File does not exist: ${path}`);
		this.code = StatusCodes.NOT_FOUND;
	}
}
