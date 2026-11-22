import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class PolicyNotFound extends Exception {
	constructor(entityName: string) {
		super(`Model(${entityName}) does not have a policy assigned.`);
		this.code = StatusCodes.NOT_FOUND;
	}
}
