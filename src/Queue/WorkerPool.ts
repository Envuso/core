import EventEmitter from "events";
import {Worker} from "worker_threads";
import {FileLoader, Log} from "../Common";
import {IWorkerResult, WorkerEvent} from "./IWorkerResult";

let instance: WorkerPool = null;

export class TaskWorker extends Worker {
	payload: string;
	isReady: boolean;

	get id() {
		return this.threadId;
	}

	run(payload: string) {
		if (!this.isReady || this.payload !== null) {
			Log.label('WorkerPool').error(`Cannot run task on busy Worker #${this.id}!`);
			return false;
		}

		this.payload = payload;
		this.postMessage(payload);

		WorkerPool.getInstance().emit('worker:run', this);
		return true;
	}

	/**
	 * Force the Worker to run a Job even if the jobPayload has not been cleared.
	 * Note: This will still fail if the Worker is not actually ready.
	 *
	 * @param {Object} payload
	 * @returns {boolean}
	 */
	runImmediate(payload: string) {
		this.payload = null;

		return this.run(payload);
	}

	free() {
		WorkerPool.getInstance().freeWorker(this);
	}
}

/**
 * Events;
 * worker:created       - Worker has been created. This is fired before it has booted.
 * worker:ready         - Worker has finished booting and is ready to accept Jobs.
 * worker:run           - Worker has started processing a Job.
 * worker:success       - Worker has successfully processed a Job.
 * worker:failed        - Worker has failed to process a Job (Job threw an unhandled exception.)
 * worker:available     - Worker is available to process another Job. This is before the Worker is pushed back into the `freeWorkers` list. This allows you to have a worker process Jobs back-to-back without waiting for the Queue to do it's loop.
 * worker:error         - Worker has thrown a critical error and will be destroyed. A new worker will be created in its place.
 * worker:freed         - Worker has been added to the `freeWorkers` list.
 */
export class WorkerPool extends EventEmitter {
	private readonly workers: TaskWorker[]     = [];
	private readonly freeWorkers: TaskWorker[] = [];

	constructor() {
		super();

		instance = this;

		for (let i = 0; i < 1; i++) {
			this.createWorker();
		}
	}

	public static getInstance() {
		if (!instance) {
			new WorkerPool();
		}

		return instance;
	}

	public getCapacity() {
		return this.freeWorkers.length;
	}

	public static getCapacity() {
		return this.getInstance().getCapacity();
	}

	runTask(payload: string) {
		if (this.freeWorkers.length === 0) {
			return false;
		}

		const worker = this.freeWorkers.shift();

		return worker.run(payload);
	}

	private createWorker() {
		let worker: TaskWorker;

		if (FileLoader.isTypescript()) {
			// For use whilst developing
			worker = new TaskWorker(
				`const path=require('path');require('ts-node/register');require(path.join(process.cwd(), 'src', 'Queue', 'Worker.ts'));`,
				{eval : true},
			);
		} else {
			worker = new TaskWorker(FileLoader.formatPathForRunEnvironment("./src/Queue/Worker.ts"));
		}

		worker.on("message", (result: IWorkerResult) => {
			switch (result.event) {
				case WorkerEvent.READY:
					worker.isReady = true;
					this.emit('worker:ready', worker);
					return;
				case WorkerEvent.ERROR:
					Log.label('WorkerPool').exception(`Worker #${worker.id} has thrown a non-critical error!`, result.error);
					break;
				case WorkerEvent.JOB_SUCCESS:
					this.emit('worker:success', worker, result);
					break;
				case WorkerEvent.JOB_ERROR:
					this.emit('worker:failed', worker, result);
					break;
			}

			this.emit('worker:available', worker);
		});

		// This should only be called when the Worker itself throws an Error.
		// Errors from the Job should be communicated back via the "message" event.
		worker.on("error", error => {
			Log.label("WorkerPool").exception(`Worker #${worker.id} has crashed!`, error);

			this.emit('worker:error', worker, error);
			this.workers.splice(this.workers.indexOf(worker), 1);
			this.createWorker();
		});

		this.workers.push(worker);
		this.emit('worker:created', worker);
	}

	public freeWorker(worker: TaskWorker) {
		Log.label('WorkerPool').debug(`Worker #${worker.id} freed`);

		worker.payload = null;

		this.freeWorkers.push(worker);
		this.emit('worker:freed', worker);
	}
}
