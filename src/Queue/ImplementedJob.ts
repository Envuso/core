import {Job} from "./Job";
import {Queueable} from "./Queueable";
import {job} from "./JobDecorators";

@job
export class ImplementedJob extends Job implements Queueable {
	constructor(public userId: number, public isAdmin: boolean = false) {
		super();
	}

	async handle() {
		await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000) + 1000));
		// Log.info("Implemented Job: " + this.userId + ", isAdmin: " + this.isAdmin);
	}
}
