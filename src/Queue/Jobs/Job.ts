import {instanceToPlain, Exclude, plainToInstance} from "class-transformer";
import {Exception} from "../../Common/Exception/Exception";
import {Str} from "../../Common/Utility/Str";
import {DateTime} from "@envuso/date-time-helper";
import type {BaseQueueable} from "./Queueable";
import {Queue} from "../Queue";

export class Job implements BaseQueueable {
	@Exclude()
	public delayUntil: DateTime = null;
	/** Set by the queue: which attempt this is, starting at 1 */
	@Exclude()
	public attempts: number     = 0;
	public id: string;
	/** How many times to retry after the first failure (0 = run once) */
	public retries: number      = 0;
	/** Seconds to wait before a retry; see retryDelay() */
	public backoff: number      = 0;

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

	/**
	 * Total runs allowed: the first attempt plus `retries`.
	 */
	maxAttempts(): number {
		return Math.max(0, this.retries ?? 0) + 1;
	}

	/**
	 * Milliseconds to wait before retrying after `attempt` failed.
	 * Override for e.g. exponential backoff: `return 1000 * 2 ** attempt`.
	 *
	 * @param {number} attempt
	 */
	retryDelay(attempt: number): number {
		return Math.max(0, this.backoff ?? 0) * 1000;
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
	 * Returning a value other than `undefined` marks the Job as handled: it won't be retried or failed.
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
			id        : this.id,
			namespace : [namespace, this.constructor.name],
			attempts  : this.attempts,
			data      : instanceToPlain(this, {enableImplicitConversion : true}),
		});
	}

	public static deserialize(rawData: string) {
		return plainToInstance(this, rawData, {enableImplicitConversion: true});
	}
}
