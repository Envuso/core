import {Job} from "./Job";
import {App} from "../AppContainer";
import Redis from "../Redis/Redis";
import {Log, DateTime} from "../Common";
import {QueueConfiguration} from "../Contracts/Configuration/QueueConfigurationContracts";
import {WorkerPool} from "./WorkerPool";

let instance: Queue = null;

export class Queue {
	private config: QueueConfiguration;
	private saturationLogged: boolean = false;

	constructor(config: QueueConfiguration) {
		if (instance) {
			return instance;
		}

		this.config = config;

		instance = this;
	}

	static getInstance() {
		return instance;
	}

	public async run() {
		await this.registerCommands();

		while (App.isBooted()) {
			// Worker Pool is still processing a batch of Jobs
			if (!WorkerPool.getInstance().hasCapacity()) {
				// Hacky solution to stop log spam when process large batch of Jobs
				if (!this.saturationLogged) {
					this.saturationLogged = true;
					Log.label("Queue").warn("Worker pool is saturated! Waiting for free workers.");
				}

				await new Promise(resolve => setTimeout(resolve, this.config.emptyWaitTimeMs));
				continue;
			}

			this.saturationLogged = false;

			// Get list of Jobs that should be run now
			const [jobsToRun, hasMore] = await Redis.getInstance().getClient()
			                                        .popQueueWithLimit("queue", "-inf", Date.now(), 4);

			for (const jobData of jobsToRun) {
				try {
					// TODO: Check if WorkerPool is saturated and put the Jobs back on the Queue
					WorkerPool.getInstance().runTask(jobData);
				} catch (error) {
					Log.label("Queue").error(error);

					// TODO: Retry failed Jobs
					// TODO: Have Job say if it should be retried
				}
			}

			// Use the shorted wait period when there are more Jobs waiting to be processed
			await new Promise(resolve => setTimeout(resolve, hasMore ? this.config.fullWaitTimeMs : this.config.emptyWaitTimeMs));
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
		// Return: [jobsArray, hasMore]
		// jobsArray - Array of serialized Jobs
		// hasMore - Will be 1 if there are more Jobs ready to be processed. nil otherwise.
		await Redis.getInstance().getClient()
		           .defineCommand("popQueueWithLimit", {
			           numberOfKeys: 1,
			           lua         : `local jobs = redis.call('zrangebyscore', KEYS[1], ARGV[1], ARGV[2], 'limit', 0, ARGV[3] + 1) local jobCount = table.getn(jobs) if (jobCount > 0) then redis.call('zremrangebyrank', KEYS[1], 0, math.min(ARGV[3] - 1, 4)) end local hasMore = jobCount > tonumber(ARGV[3]) return {jobs, hasMore}`,
		           });
	}
}
