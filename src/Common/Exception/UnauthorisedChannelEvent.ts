import {Exception} from "./Exception";

export class UnauthorisedChannelEvent extends Exception {
	constructor() {
		super("No event defined on received ws packet");
	}
}
