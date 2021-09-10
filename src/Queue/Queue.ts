import {Worker} from "worker_threads";
import {Job} from "./Job";
import {App} from "../AppContainer";
import Redis from "../Redis/Redis";
import {Log, DateTime} from "../Common";
import {QueueConfiguration} from "../Contracts/Configuration/QueueConfigurationContracts";
import {WorkerPool} from "./WorkerPool";

let instance: Queue = null;

export class Queue {
	private config: QueueConfiguration;

	constructor(config: QueueConfiguration) {
		if (instance) {
			return instance;
		}

		this.config = config;

		instance = this;

		WorkerPool.getInstance().on('worker:freed', this.onWorkerFreed.bind(this));
	}

	static getInstance() {
		return instance;
	}

	public async run() {
		await this.registerCommands();

		while (App.isBooted()) {
			// Worker Pool is still processing a batch of Jobs
			if (WorkerPool.getCapacity() === 0) {
				Log.label("Queue").debug("Waiting for free workers...");
				await new Promise(resolve => setTimeout(resolve, this.config.waitTimeMs));
				continue;
			}

			// Get list of Jobs that should be run now
			const jobsToRun = await Redis.getInstance().getClient()
				.popQueueWithLimit("queue", "-inf", Date.now(), WorkerPool.getCapacity());

			for (const jobData of jobsToRun) {
				try {
					const result = WorkerPool.getInstance().runTask(jobData);

					// WorkerPool is full, pop it back on the Queue
					if (!result) {
						// Should we follow retry logic here and add some delay?
						await Redis.zAdd('queue', Date.now(), jobData);
					}
				} catch (error) {
					Log.label("Queue").error(error);

					// TODO: Retry failed Jobs
					// TODO: Have Job say if it should be retried
				}
			}

			await new Promise(resolve => setTimeout(resolve, this.config.waitTimeMs));
		}
	}

	public static async dispatch(job: Job, delayUntil?: DateTime) {
		const runAt = new Date(delayUntil?.toTime() ?? Date.now());
		await Redis.zAdd("queue", runAt.getTime(), job.serialize());

		const {namespace} = Reflect.getMetadata("job", job.constructor);

		Log.label("Queue").info(`Queued: ${namespace.split(":")[0]} (${runAt})`);
	}

	private async registerCommands() {
		// Allows us to get a limited number of items (limit) withing a range (min/max) whilst also removing them from Redis
		// Command: popQueueWithLimit envuso-queue -inf Date.now() 5
		// Return: string[] - Array of serialized Jobs
		await Redis.getInstance().getClient()
			.defineCommand("popQueueWithLimit", {
				numberOfKeys : 1,
				lua          : `local jobs = redis.call('zrangebyscore', KEYS[1], ARGV[1], ARGV[2], 'limit', 0, ARGV[3]) local jobCount = table.getn(jobs) if (jobCount > 0) then redis.call('zremrangebyrank', KEYS[1], 0, jobCount - 1) end return jobs`,
			});
	}

	private async onWorkerFreed(worker: Worker) {
		const jobsToRun = await Redis.getInstance().getClient()
			.popQueueWithLimit("queue", "-inf", Date.now(), 1);

		console.log(jobsToRun);

		if (jobsToRun.length === 1) {
			// Bypass the checks done via WorkerPool.runTask as the Worker has indicated they're free and is requesting another Job.
			worker.postMessage(jobsToRun[0]);
		} else {
			WorkerPool.getInstance().freeWorker(worker);
		}
	}
}
