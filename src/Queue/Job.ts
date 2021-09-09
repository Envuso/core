import {classToPlain, plainToClass} from "class-transformer";
import {Exception} from "../Common";
import {BaseQueueable} from "./Queueable";
import {Queue} from "./Queue";

export class Job implements BaseQueueable {
	handle(): Promise<void> {
		throw new Exception("Bruh, implement handle()");
	}

	dispatch() {
		Queue.dispatch(this);
	}

	serialize() {
		const {namespace} = Reflect.getMetadata("job", this.constructor);

		return JSON.stringify({
			t: `${namespace}:${this.constructor.name}`,
			d: classToPlain(this, {enableImplicitConversion: true}),
		});
	}

	public static deserialize(rawData: string) {
		return plainToClass(this, rawData, {enableImplicitConversion: true});
	}
}
