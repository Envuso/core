import {Redis} from "../../Redis/Redis";
import {Job} from "../../Queue/Jobs/Job";
import {job} from "../../Queue/Jobs/JobDecorators";

/**
 * Jobs used by queue.spec.ts. They run in a worker thread and report back through Redis.
 */

@job
export class RecordingJob extends Job {
	constructor(public marker: string, public bigNumber: number = 0) {
		super();
	}

	async handle() {
		await Redis.set(`queue-test:${this.marker}`, {attempts : this.attempts, bigNumber : this.bigNumber});
	}
}

@job
export class FlakyJob extends Job {
	retries = 2;

	constructor(public marker: string, public succeedOnAttempt: number) {
		super();
	}

	async handle() {
		if (this.attempts < this.succeedOnAttempt) {
			throw new Error(`flaky attempt ${this.attempts}`);
		}

		await Redis.set(`queue-test:${this.marker}`, {attempts : this.attempts});
	}
}

@job
export class AlwaysFailsJob extends Job {
	retries = 1;

	constructor(public marker: string) {
		super();
	}

	async handle() {
		throw new Error('always fails');
	}

	async failed(error: Error) {
		await Redis.set(`queue-test:${this.marker}:failed`, {attempts : this.attempts, message : error.message});
	}
}
