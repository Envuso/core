import "reflect-metadata";
import {parentPort, workerData} from "worker_threads";
import Environment from "../AppContainer/Config/Environment";
import {FileLoader} from "../Common/Utility/FileLoader";
import {Log} from "../Common/Logger/Log";
import ConfigurationFile from "../AppContainer/Config/ConfigurationFile";
import {Envuso} from "../Envuso";
import {type IWorkerError, type IWorkerResult, type IWorkerTask, WorkerEvent} from "./IWorkerResult";
import {MaxAttemptsExceededException} from "./Jobs/Exceptions/MaxAttemptsExceededException";
import {Job} from "./Jobs/Job";

Environment.load();

(async function () {
	const envuso = new Envuso();

	// The app's configuration, not the framework's own test config
	await ConfigurationFile.initiateAppConfiguration(workerData?.configurationPath);
	await envuso.bootInWorker();

	parentPort.on("message", processJob);
	post({event : WorkerEvent.READY});
})().catch(error => {
	// Booting failed; let the pool see it as a crashed worker
	Log.exception('Queue worker failed to boot', error);
	process.exit(1);
});

let busy = false;

interface IJobData {
	id: string;
	namespace: string[];
	data: any;
}

async function processJob(task: IWorkerTask) {
	if (busy) {
		post({event : WorkerEvent.ERROR, error : toWorkerError(new Error('Worker already has an active Job!'))});
		return;
	}

	busy = true;

	const jobStart = Date.now();
	let job: Job   = null;
	let name       = 'unknown job';

	try {
		const data: IJobData = JSON.parse(task.payload);
		name                 = data.namespace?.[1] ?? name;

		Log.label("QueueWorker").info(`Processing: ${name} (attempt ${task.attempts})`);

		job          = await hydrateJob(data);
		job.attempts = task.attempts;
	} catch (error) {
		// Can't load it, so it can never run: don't retry
		Log.label('QueueWorker').exception(`Could not load: ${name}`, error);
		busy = false;
		post({event : WorkerEvent.JOB_ERROR, error : toWorkerError(error)});
		return;
	}

	try {
		// Reached when the job kept crashing/hanging its worker and its reservation expired
		if (job.attempts > job.maxAttempts()) {
			throw new MaxAttemptsExceededException(name);
		}

		await job.handle();

		Log.label("QueueWorker").info(`Processed: ${name} (${Date.now() - jobStart}ms)`);
		post({event : WorkerEvent.JOB_SUCCESS});
	} catch (error) {
		post(await handleFailure(job, name, error, jobStart));
	} finally {
		busy = false;
	}
}

async function handleFailure(job: Job, name: string, error: any, jobStart: number): Promise<IWorkerResult> {
	if (!(error instanceof MaxAttemptsExceededException)) {
		try {
			if (await job.handleException(error) !== undefined) {
				Log.label('QueueWorker').info(`Handled: ${name} (${Date.now() - jobStart}ms)`);
				return {event : WorkerEvent.JOB_SUCCESS};
			}
		} catch (handlerError) {
			error = handlerError;
		}

		if (job.attempts < job.maxAttempts()) {
			const retryInMs = job.retryDelay(job.attempts);

			Log.label('QueueWorker').warn(`Failed: ${name}, retrying in ${retryInMs}ms (attempt ${job.attempts}/${job.maxAttempts()})`);
			return {event : WorkerEvent.JOB_RETRY, error : toWorkerError(error), retryInMs};
		}
	}

	Log.label('QueueWorker').exception(`Failed: ${name} (${Date.now() - jobStart}ms)`, error);

	try {
		await job.failed(error);
	} catch (failedError) {
		Log.label('QueueWorker').exception(`${name}.failed() threw`, failedError);
	}

	return {event : WorkerEvent.JOB_ERROR, error : toWorkerError(error)};
}

async function hydrateJob(data: IJobData): Promise<Job> {
	const modules   = await FileLoader.importModulesFrom(data.namespace[0]);
	const jobModule = modules.find(module => module.name === data.namespace[1]);

	if (!jobModule) {
		throw new Error(`Could not load Job with namespace "${data.namespace[0]}:${data.namespace[1]}"`);
	}

	const job = jobModule.instance as unknown as typeof Job;

	return job.deserialize(data.data) as Job;
}

function toWorkerError(error: any): IWorkerError {
	return {
		name    : error?.name ?? 'Error',
		message : error?.message ?? String(error),
		stack   : error?.stack,
	};
}

function post(result: IWorkerResult) {
	parentPort.postMessage(result);
}
