import {Exception} from "../../Common/Exception/Exception";
import {StatusCodes} from "../../Common/Http/StatusCodes/StatusCodes";

export class InvalidAccessTokenResponseException extends Exception {
	constructor(responseData: any) {
		super("Failed to get access token data: " + JSON.stringify(responseData), StatusCodes.BAD_REQUEST);
	}
}
