import {User} from "../App/Models/User";
import {DataTransferObject} from "../Routing";
import {job, Job} from "./Job";
import {Queueable} from "./Queueable";

export class JobSerializableData extends DataTransferObject {
	user: User;
	someString: string;
}

@job
export class ImplementedJob extends Job<JobSerializableData> implements Queueable {

	async handle() {
	}

}
