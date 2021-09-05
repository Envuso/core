import {Exception, StatusCodes} from "../../Common";

export class PolicyNotFound extends Exception {
	constructor(entityName: string) {
		super(`Model(${entityName}) does not have a policy assigned.`);
		this.code = StatusCodes.NOT_FOUND;
	}
}
