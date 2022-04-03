import {Exception, StatusCodes} from "../../Common";

export class InvalidAccessTokenResponseException extends Exception {
	constructor(responseData: any) {
		super("Failed to get access token data: " + JSON.stringify(responseData), StatusCodes.BAD_REQUEST);
	}
}
