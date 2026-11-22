import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class ModelNotFoundException extends Exception {
	constructor(entityName: string) {
		super(`Model(${entityName}} cannot be found.`);
		this.code = StatusCodes.NOT_FOUND;
	}
}
