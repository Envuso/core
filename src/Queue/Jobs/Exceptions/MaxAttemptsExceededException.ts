import {Exception} from "../../../Common/Exception/Exception";

export class MaxAttemptsExceededException extends Exception {
	constructor(namespace: string) {
		super(`${namespace} has been attempted too many times.`);
	}
}
