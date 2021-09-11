import {IWorkerResult} from "./IWorkerResult";
import {Job} from "./Jobs/Job";
import {App} from "../AppContainer";
import Redis from "../Redis/Redis";
import {Log, DateTime} from "../Common";
import {QueueConfiguration} from "../Contracts/Configuration/QueueConfigurationContracts";
import LuaScripts from "./LuaScripts";
import {TaskWorker, WorkerPool} from "./WorkerPool";

let instance: Queue = null;

export class Queue {
	private config: QueueConfiguration;
	// Primary Queue where Jobs that are ready to process are stored
	private static queueName         = 'queue';
	// Queue where Jobs that have a delay are stored
	private static delayedQueueName  = 'queue:delayed';
	// Queue where Jobs that are currently being processed are stored
	private static reservedQueueName = 'queue:reserved';

	constructor(config: QueueConfiguration) {
		if (instance) {
			return instance;
		}

		this.config = config;

		instance = this;

		WorkerPool.getInstance().on('worker:ready', this.onWorkerAvailable.bind(this));
		WorkerPool.getInstance().on('worker:success', this.onWorkerSuccess.bind(this));
		WorkerPool.getInstance().on('worker:failed', this.onWorkerFailed.bind(this));
		WorkerPool.getInstance().on('worker:available', this.onWorkerAvailable.bind(this));
	}

	static getInstance() {
		return instance;
	}

	public async run() {
		await this.registerCommands();
		const jobsRecovered = await this.recover();

		if (jobsRecovered > 0) {
			Log.label('Queue').info(`Recovered ${jobsRecovered} incomplete Jobs`);
		}

		while (App.isBooted()) {
			await this.migrate();

			if (WorkerPool.getCapacity() == 0) {
				Log.label('Queue').warn('No workers available');
				await new Promise(resolve => setTimeout(resolve, this.config.waitTimeMs));
				continue;
			}

			const jobs = await this.getNextJob(WorkerPool.getCapacity());

			for (const payload of jobs) {
				const result = WorkerPool.getInstance().runTask(payload);

				// WorkerPool is full, pop it back on the Queue
				if (!result) {
					await Queue.pushRaw(payload);
				}
			}

			await new Promise(resolve => setTimeout(resolve, this.config.waitTimeMs));
		}
	}

	public static async dispatch(job: Job) {
		if (!job.hasDelay()) {
			await this.push(job);
		} else {
			await this.later(job, job.delayUntil);
		}

		const {namespace} = Reflect.getMetadata("job", job.constructor);

		Log.label("Queue").info(`Queued: ${namespace}`);
	}

	/**
	 * Push a Job onto the Queue so it can be processed.
	 *
	 * @param {Job} job
	 * @returns {Promise<void>}
	 */
	public static push(job: Job) {
		return this.pushRaw(job.serialize());
	}

	public static pushRaw(job: string) {
		return Redis.pushToEnd(Queue.queueName, job);
	}

	/**
	 * Push a Job onto the Delayed Queue so it can be processed at a later time.
	 *
	 * @param {Job} job
	 * @param {DateTime} delayUntil
	 * @returns {Promise<void>}
	 */
	public static later(job: Job, delayUntil: DateTime) {
		return this.laterRaw(job.serialize(), delayUntil);
	}

	public static laterRaw(job: string, delayUntil: DateTime) {
		return Redis.zAdd(Queue.delayedQueueName, delayUntil.toTime(), job);
	}

	/*
	 Private Functions
	 */

	private recover() {
		return Redis.getInstance().getClient().moveList(Queue.reservedQueueName, Queue.queueName);
	}

	private async registerCommands() {
		await Redis.getInstance().getClient().defineCommand('pop', LuaScripts.pop());
		await Redis.getInstance().getClient().defineCommand('migrateQueue', LuaScripts.migrateQueue());
		await Redis.getInstance().getClient().defineCommand('moveList', LuaScripts.moveList());
	}

	/**
	 * Migrate Jobs from the Delayed Queue onto the Primary Queue
	 *
	 * @returns {Promise<string[]>}
	 * @private
	 */
	private migrate(): Promise<string[]> {
		return Redis.getInstance().getClient().migrateQueue(Queue.delayedQueueName, Queue.queueName, Date.now());
	}

	/**
	 * Get the next x number of Jobs that are ready to be processed
	 *
	 * @param {number} capacity
	 * @returns {Promise<string[]>}
	 * @private
	 */
	private getNextJob(capacity: number = 1): Promise<string[]> {
		return Redis.getInstance().getClient().pop(Queue.queueName, Queue.reservedQueueName, capacity);
	}

	/*
	 Worker Events
	 */

	private async onWorkerAvailable(worker: TaskWorker) {
		const jobs = await this.getNextJob();

		if (jobs.length === 1) {
			// Have the Worker run another Job right away.
			worker.runImmediate(jobs[0]);
		} else {
			// Mark the Worker as available so the Queue can use it on its next loop.
			worker.free();
		}
	}

	private async onWorkerSuccess(worker: TaskWorker, result: IWorkerResult) {
		await Redis.lRemove(Queue.reservedQueueName, 1, worker.payload);
	}

	private async onWorkerFailed(worker: TaskWorker, result: IWorkerResult) {
		// Remove the Job from the reserved Queue because it's not being processed anymore
		await Redis.lRemove(Queue.reservedQueueName, 1, worker.payload);

		// Don't push back into queue if the next attempt will just fail anyways
		if (result.job.attempts > result.job.retries) {
			return;
		}

		// FIXME: There is potential for this Job to be lost if something happens between the lRemove above and this zAdd
		await Queue.pushRaw(worker.payload);
	}
}
