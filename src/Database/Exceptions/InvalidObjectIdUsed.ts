import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class InvalidObjectIdUsed extends Exception {
	constructor(entityName: string) {
		super(`Model(${entityName}} cannot be loaded with an invalid object id`);
		this.code = StatusCodes.BAD_REQUEST;
	}
}
