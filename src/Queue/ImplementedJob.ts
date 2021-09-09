import {Job} from "./Job";
import {Queueable} from "./Queueable";
import {Log} from "../Common";
import {job} from "./JobDecorators";

@job
export class ImplementedJob extends Job implements Queueable {
	constructor(public userId: number, public isAdmin: boolean = false) {
		super();
	}

	async handle() {
		Log.info("Implemented Job: " + this.userId + ", isAdmin: " + this.isAdmin);
	}
}
