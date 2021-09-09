import "reflect-metadata";
import {parentPort} from "worker_threads";
import {FileLoader, Log} from "../Common";
import {Job} from "./Job";

parentPort.on("message", async jobData => {
	// Start the timer before the log because JSON parsing actually takes time,
	const jobStart = Date.now();
	const {t: namespace, d: data} = JSON.parse(jobData);
	const [jobFilePath, jobClassName] = namespace.split(":");

	// but we don't have the namespace until it's been parsed...
	Log.label("QueueWorker").info(`Processing: ${jobFilePath}`);

	const job = await hydrateJob(jobFilePath, jobClassName, data);

	await job.handle();

	Log.label("QueueWorker").info(`Processed: ${jobFilePath} (${Date.now() - jobStart}ms)`);

	parentPort.postMessage(true);
});

async function hydrateJob(filePath: string, jobClassName: string, data: string): Promise<Job> {
	const modules = await FileLoader.importModulesFrom(filePath);
	const jobModule = modules.find(module => module.name === jobClassName);

	if (!jobModule) {
		throw new Error(`Could not load Job with namespace "${filePath}:${jobClassName}"`);
	}

	const job = jobModule.instance as typeof Job;

	return job.deserialize(data);
}
