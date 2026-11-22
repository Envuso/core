import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class PolicyPermissionNotFound extends Exception {
	constructor(entityName: string, permissionName: string) {
		super(`Model(${entityName}} does not have a method named: ${permissionName}`);
		this.code = StatusCodes.NOT_FOUND;
	}
}
