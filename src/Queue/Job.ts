import {classToPlain, Exclude, plainToClass} from "class-transformer";
import {DateTime, Exception} from "../Common";
import {BaseQueueable} from "./Queueable";
import {Queue} from "./Queue";

export class Job implements BaseQueueable {
	@Exclude()
	private delayUntil: DateTime = null;

	handle(): Promise<void> {
		throw new Exception("Bruh, implement handle()");
	}

	delay(time: DateTime) {
		this.delayUntil = time;

		return this;
	}

	dispatch() {
		return Queue.dispatch(this, this.delayUntil);
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
