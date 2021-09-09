import {Job} from "./Job";
import {App} from "../AppContainer";
import Redis from "../Redis/Redis";
import {Log, FileLoader} from "../Common";
import {QueueConfiguration} from "../Contracts/Configuration/QueueConfigurationContracts";

let instance: Queue = null;

export class Queue {
	private latestInsertScores: number[] = [];
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
			// Get list of Jobs that should be run now
			// result - [ [error, results[]], [error, numRemoved] ]
			const [jobsToRun, _] = await Redis.getInstance().getClient()
			                                  .multi()
			                                  .zrangebyscore("queue", 0, Date.now())
			                                  .zremrangebyscore("queue", 0, Date.now())
			                                  .exec();

			for (const jobData of jobsToRun[1]) {
				try {
					// Start the timer before the log because JSON parsing actually takes time,
					const jobStart = Date.now();
					const {t: namespace, d: data} = JSON.parse(jobData);
					const [jobFilePath, jobClassName] = namespace.split(":");

					// but we don't have the namespace until it's been parsed...
					Log.label("Queue").info(`Processing: ${jobFilePath}`);

					const job = await this.hydrateJob(jobFilePath, jobClassName, data);

					await job.handle();

					Log.label("Queue").info(`Processed: ${jobFilePath} (${Date.now() - jobStart}ms)`);
				} catch (error) {
					Log.label("Queue").error(error);

					// TODO: Retry failed Jobs
					// TODO: Have Job say if it should be retried
				}
			}

			await new Promise(resolve => setTimeout(resolve, this.config.waitTimeMs));
		}
	}

	public static async dispatch(job: Job) {
		await Redis.zAdd("queue", Date.now(), job.serialize());

		const {namespace} = Reflect.getMetadata("job", job.constructor);

		Log.label("Queue").info(`Queued: ${namespace.split(":")[0]}`);
	}

	private async hydrateJob(filePath: string, jobClassName: string, data: string): Promise<Job> {
		const modules = await FileLoader.importModulesFrom(filePath);
		const jobModule = modules.find(module => module.name === jobClassName);

		if (!jobModule) {
			throw new Error(`Could not load Job with namespace "${filePath}:${jobClassName}"`);
		}

		const job = jobModule.instance as typeof Job;

		return job.deserialize(data);
	}
}
