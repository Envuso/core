import {DataTransferObject} from "../Routing";

export class Job<T extends DataTransferObject> {

	public data: T = null;

	constructor(data: T) {
		this.data = data;
	}

	public dispatch(data: T) {

	}

	public static dispatch<J extends typeof Job>(this: J) {

	}

}
