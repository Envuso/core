import {Type} from "class-transformer";
import {handler, job, Job} from "./Job";
import {JobSerializableData} from "./JobSerializableData";
import {Queueable} from "./Queueable";


@job
export class ImplementedJob extends Job<JobSerializableData> implements Queueable {

	public someUserId: string                      = 'fucking weeb code';
	public someFuckingNumber: number               = 69;

	public fuckingBullshitDTO: JobSerializableData = null;

	constructor(someUserId: string, someNumber: number, data: any) {
		super();

		this.someUserId         = someUserId;
		this.someFuckingNumber  = someNumber;
		this.fuckingBullshitDTO = data;
	}

	async handle() {
	}

}
