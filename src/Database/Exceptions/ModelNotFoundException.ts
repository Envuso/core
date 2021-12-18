import {Exception, StatusCodes} from "../../Common";

export class ModelNotFoundException extends Exception {
	constructor(entityName: string) {
		super(`Model(${entityName}} cannot be found.`);
		this.code = StatusCodes.NOT_FOUND;
	}
}
