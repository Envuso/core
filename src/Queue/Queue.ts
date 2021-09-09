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
	}

	static getInstance() {
		return instance;
	}

	public async run() {
		while (App.isBooted()) {
			// Worker Pool is still processing a batch of Jobs
			if (!WorkerPool.getInstance().hasCapacity()) {
				await new Promise(resolve => setTimeout(resolve, this.config.waitTimeMs));
				continue;
			}

			// Get list of Jobs that should be run now
			// result - [ [error, results[]], [error, numRemoved] ]
			const [jobsToRun, _] = await Redis.getInstance().getClient()
			                                  .multi()
			                                  .zrangebyscore("queue", 0, Date.now())
			                                  .zremrangebyscore("queue", 0, Date.now())
			                                  .exec();

			for (const jobData of jobsToRun[1]) {
				try {
					WorkerPool.getInstance().runTask(jobData);
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
}
