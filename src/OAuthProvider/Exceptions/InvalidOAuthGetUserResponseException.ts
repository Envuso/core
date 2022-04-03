import {Exception, StatusCodes} from "../../Common";

export class InvalidOAuthGetUserResponseException extends Exception {
	constructor(responseData: any) {
		super("Failed to get user from api; data: " + JSON.stringify(responseData), StatusCodes.BAD_REQUEST);
	}
}
