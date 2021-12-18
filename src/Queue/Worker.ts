import path from "path";
import "reflect-metadata";
import {parentPort} from "worker_threads";
import Environment from "../AppContainer/Config/Environment";
import {FileLoader, Log} from "../Common";
import Configuration from "../Config/Configuration";
import {Envuso} from "../Envuso";
import {IWorkerJob, WorkerEvent} from "./IWorkerResult";
import {MaxAttemptsExceededException} from "./Jobs/Exceptions/MaxAttemptsExceededException";
import {Job} from "./Jobs/Job";

Environment.load(path.join(process.cwd(), ".env"));

(async function () {
	const envuso = new Envuso();

	await Configuration.initiate();
	await envuso.bootInWorker();

	parentPort.on("message", processJob);
	parentPort.postMessage({event : WorkerEvent.READY});
})();

const kJobNamespace = Symbol('kJobNamespace');
let currentJob: Job = null;

interface IJobData {
	namespace: string[];
	attempts: number;
	data: any;
}

async function processJob(payload: string) {
	if (currentJob !== null) {
		notifyMainThreadError(WorkerEvent.ERROR, new Error('Worker already has an active Job!'));
		return;
	}

	// Start the timer before the log because JSON parsing actually takes time,
	const jobStart       = Date.now();
	const data: IJobData = JSON.parse(payload);

	try {
		// but we don't have the namespace until it's been parsed...
		Log.label("QueueWorker").info(`Processing: ${data.namespace[0]}`);

		currentJob = await hydrateJob(data);

		if (currentJob.attempts > currentJob.retries) {
			throw new MaxAttemptsExceededException(data.namespace[0]);
		}

		await currentJob.handle();

		Log.label("QueueWorker").info(`Processed: ${data.namespace[0]} (${Date.now() - jobStart}ms)`);

		notifyMainThread(WorkerEvent.JOB_SUCCESS);
	} catch (error) {
		if (!currentJob) {
			// Error whilst hydrating Job
			notifyMainThreadError(WorkerEvent.JOB_ERROR, error);
			return;
		}

		if (error instanceof MaxAttemptsExceededException) {
			await currentJob.failed(error);
			notifyMainThreadError(WorkerEvent.JOB_ERROR, error);
			return;
		}

		const result = await currentJob.handleException(error);

		if (result === undefined) {
			Log.label('QueueWorker').error(`Failed: ${data.namespace[0]} (${Date.now() - jobStart}ms)`, error);
			notifyMainThreadError(WorkerEvent.JOB_ERROR, error);
		}
	} finally {
		currentJob = null;
	}
}

async function hydrateJob(data: IJobData): Promise<Job> {
	const modules   = await FileLoader.importModulesFrom(data.namespace[0]);
	const jobModule = modules.find(module => module.name === data.namespace[1]);

	if (!jobModule) {
		throw new Error(`Could not load Job with namespace "${data.namespace[0]}:${data.namespace[1]}"`);
	}

	const job      = jobModule.instance as typeof Job;
	const instance = job.deserialize(data.data);

	instance[kJobNamespace] = data.namespace;
	instance.attempts       = data.attempts;

	return instance;
}

function notifyMainThread(event: WorkerEvent) {
	parentPort.postMessage({
		event,
		job : getJobNotifyData()
	});
}

function notifyMainThreadError(event: WorkerEvent, error: Error) {
	parentPort.postMessage({
		event,
		error,
		job : getJobNotifyData()
	});
}

function getJobNotifyData(): IWorkerJob {
	if (!currentJob) {
		return;
	}

	return {
		namespace : currentJob[kJobNamespace],
		attempts  : currentJob.attempts,
		retries   : currentJob.retries
	};
}
