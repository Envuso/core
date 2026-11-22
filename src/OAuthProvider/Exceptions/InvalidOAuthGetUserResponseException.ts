import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class InvalidOAuthGetUserResponseException extends Exception {
	constructor(responseData: any) {
		super("Failed to get user from api; data: " + JSON.stringify(responseData), StatusCodes.BAD_REQUEST);
	}
}
