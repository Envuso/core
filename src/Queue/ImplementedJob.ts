import {User} from "../App/Models/User";
import {DataTransferObject} from "../Routing";
import {Job} from "./Job";
import {Queue} from "./Queue";
import {Queueable} from "./Queueable";

export class JobSerializableData extends DataTransferObject {
	user: User;
	someString: string;
}

export class TestingNonCompatible extends DataTransferObject {

}

export class ImplementedJob extends Job<JobSerializableData> implements Queueable {

	async handle() {

	}

}

const data = new JobSerializableData();
data.someString = 'wtf';

const noCompat = new TestingNonCompatible();

// const j = new ImplementedJob();
// j.dispatch(noCompat); // This one complains...
// j.dispatch(data);  // this one does not, as expected..

Queue.dispatch(new ImplementedJob(data));
Queue.dispatch(new ImplementedJob(noCompat));

