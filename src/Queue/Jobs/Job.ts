import {classToPlain, Exclude, plainToClass} from "class-transformer";
import {Exception, Str} from "../../Common";
import {DateTime} from "@envuso/date-time-helper";
import {BaseQueueable} from "./Queueable";
import {Queue} from "../Queue";

export class Job implements BaseQueueable {
	@Exclude()
	public delayUntil: DateTime = null;
	@Exclude()
	public attempts: number     = 0;
	public id: string;
	public retries: number      = 0;

	constructor() {
		this.id = Str.uniqueRandom();
	}

	delay(time: DateTime) {
		this.delayUntil = time;

		return this;
	}

	/**
	 * Returns true if a delay is set and is in the future.
	 *
	 * @returns {boolean}
	 */
	hasDelay() {
		return this.delayUntil && this.delayUntil.toTime() > Date.now();
	}

	dispatch() {
		return Queue.dispatch(this);
	}

	/*
	 Core
	 */

	/**
	 * Does the shit you want this Job to do.
	 *
	 * @returns {Promise<void>}
	 */
	handle(): Promise<void> {
		throw new Exception("Bruh, implement handle()");
	}

	/**
	 * Called when a Job fails and will not retry.
	 *
	 * @param {Error | Exception} error
	 * @returns {Promise<void>}
	 */
	async failed(error: Error | Exception): Promise<void> {
	}

	/**
	 * Returning a value other then `undefined` will not bubble up the Error to the Queue.
	 *
	 * @param {Error} error
	 * @returns {Promise<any>}
	 */
	async handleException(error: Error): Promise<any> {
	}

	/*
	 Misc
	 */

	serialize() {
		const {namespace} = Reflect.getMetadata("job", this.constructor);

		return JSON.stringify({
			namespace : [namespace, this.constructor.name],
			attempts  : this.attempts,
			data      : classToPlain(this, {enableImplicitConversion : true}),
		});
	}

	public static deserialize(rawData: string) {
		return plainToClass(this, rawData, {enableImplicitConversion: true});
	}
}
