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
		Log.label("Queue").debug("Is App Booted? " + App.isBooted());
		while (App.isBooted()) {
			Log.label("Queue").debug("Queue run");
			// const job = await this.hydrateJob("");
			// await job.handle();

			Log.label("Queue").debug("Fetch Jobs...");
			const jobsToRun = await Redis.zRangeByScore("queue", "-inf", Date.now(), `LIMIT 0 ${this.config.jobsPerBatch}`);
			Log.label("Queue").debug("Jobs Fetched:", jobsToRun);

			await new Promise(resolve => setTimeout(resolve, 1_000));
		}
	}

	public static dispatch(job: Job) {
		return Redis.zAdd("queue", this.getInstance().getInsertScore(), job.serialize())
		            .then(result => {
			            Log.label("Queue").debug("Job Added Successfully");

			            return result;
		            });
	}

	private async hydrateJob(rawData: string): Promise<Job> {
		const {t: namespace, d: data} = JSON.parse(rawData);
		const [jobFilePath, jobClassName] = namespace.split(":");
		const modules = await FileLoader.importModulesFrom(jobFilePath);
		const jobModule = modules.find(module => module.name === jobClassName);

		if (!jobModule) {
			throw new Error(`Could not load Job with namespace "${namespace}"`);
		}

		const job = jobModule.instance as typeof Job;

		return job.deserialize(data);
	}

	/**
	 * Used to get a non-overlapping key
	 *
	 * @private
	 */
	private getInsertScore() {
		let score = Date.now();

		if (this.latestInsertScores.includes(score)) {
			score = this.latestInsertScores[0] + 1;
		}

		// Keep only 5 keys
		this.latestInsertScores.unshift(score);
		this.latestInsertScores = this.latestInsertScores.splice(0, 5);

		Log.label("Queue").debug("Scores:", this.latestInsertScores);

		return score;
	}
}
