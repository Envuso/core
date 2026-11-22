import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class FileDoesNotExistException extends Exception {
	constructor(path: string) {
		super(`File does not exist: ${path}`);
		this.code = StatusCodes.NOT_FOUND;
	}
}
