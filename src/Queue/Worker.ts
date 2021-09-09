import "reflect-metadata";
import path from "path";
import {parentPort} from "worker_threads";
import Environment from "../AppContainer/Config/Environment";
import {Log, FileLoader} from "../Common";
import Configuration from "../Config/Configuration";
import {Envuso} from "../Envuso";
import {Job} from "./Job";
//@ts-ignore
import {setTimeout} from 'timers/promises';

Environment.load(path.join(__dirname, '..', '..', '.env'));

const envuso = new Envuso();
let booted   = false;

const boot = async () => {
	await Configuration.initiate();
	await envuso.bootInWorker();

	booted = true;
};

boot().catch(error => Log.exception('Boot error: ', error));

const waitForBoot = async () => {
	if (!booted) {
		Log.info('Waiting for envuso to boot...');
		await setTimeout(100);
		Log.info('After wait timeout...');
		await waitForBoot();
	}
};

console.log("Worker Booted");

parentPort.on("message", async jobData => {
	await waitForBoot();

	// Start the timer before the log because JSON parsing actually takes time,
	const jobStart                    = Date.now();
	const {t : namespace, d : data}   = JSON.parse(jobData);
	const [jobFilePath, jobClassName] = namespace.split(":");

	// but we don't have the namespace until it's been parsed...
	// Log.label("QueueWorker").info(`Processing: ${jobFilePath}`);

	const job = await hydrateJob(jobFilePath, jobClassName, data);

	await job.handle();

	// Log.label("QueueWorker").info(`Processed: ${jobFilePath} (${Date.now() - jobStart}ms)`);

	parentPort.postMessage(true);
});

async function hydrateJob(filePath: string, jobClassName: string, data: string): Promise<Job> {
	const modules   = await FileLoader.importModulesFrom(filePath);
	const jobModule = modules.find(module => module.name === jobClassName);

	if (!jobModule) {
		throw new Error(`Could not load Job with namespace "${filePath}:${jobClassName}"`);
	}

	const job = jobModule.instance as typeof Job;

	return job.deserialize(data);
}
