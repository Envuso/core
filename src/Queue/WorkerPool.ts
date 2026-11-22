import EventEmitter from "events";
import path from "path";
import {Worker} from "worker_threads";
import {Log} from "../Common/Logger/Log";
import {type IWorkerResult, WorkerEvent} from "./IWorkerResult";
import type {ReservedJob} from "./QueueStore";

let instance: WorkerPool = null;

export class TaskWorker extends Worker {
	job: ReservedJob = null;
	isReady: boolean = false;

	get id() {
		return this.threadId;
	}

	run(job: ReservedJob) {
		if (!this.isReady || this.job !== null) {
			Log.label('WorkerPool').error(`Cannot run task on busy Worker #${this.id}!`);
			return false;
		}

		this.job = job;
		this.postMessage({payload : job.payload, attempts : job.attempts});

		WorkerPool.getInstance().emit('worker:run', this);
		return true;
	}

	/**
	 * Run the next Job straight away, without going back to the free list.
	 * Note: This will still fail if the Worker is not actually ready.
	 */
	runImmediate(job: ReservedJob) {
		this.job = null;

		return this.run(job);
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
 * worker:retry         - The Job threw and should be retried (result.retryInMs).
 * worker:failed        - The Job threw and will not be retried.
 * worker:available     - Worker can process another Job. Fired before it is put back on the free list, so the Queue can hand it the next Job straight away.
 * worker:error         - Worker crashed and will be replaced.
 * worker:freed         - Worker has been added to the free list.
 */
export class WorkerPool extends EventEmitter {
	private readonly workers: TaskWorker[]     = [];
	private readonly freeWorkers: TaskWorker[] = [];
	private terminating                        = false;

	constructor(size: number = 1) {
		super();

		instance = this;

		for (let i = 0; i < size; i++) {
			this.createWorker();
		}
	}

	public static getInstance() {
		return instance;
	}

	public getCapacity() {
		return this.freeWorkers.length;
	}

	public static getCapacity() {
		return instance?.getCapacity() ?? 0;
	}

	/**
	 * Jobs currently running on a worker
	 */
	public runningJobs(): ReservedJob[] {
		return this.workers.filter(w => w.job).map(w => w.job);
	}

	runTask(job: ReservedJob) {
		const worker = this.freeWorkers.shift();

		if (!worker) {
			return false;
		}

		return worker.run(job);
	}

	public async terminate() {
		this.terminating = true;
		this.freeWorkers.length = 0;

		await Promise.all(this.workers.splice(0).map(worker => worker.terminate()));

		if (instance === this) {
			instance = null;
		}
	}

	private createWorker() {
		// Bun runs the TypeScript worker file directly
		const worker = new TaskWorker(path.join(import.meta.dir, 'Worker.ts'));

		worker.on("message", (result: IWorkerResult) => {
			switch (result.event) {
				case WorkerEvent.READY:
					worker.isReady = true;
					this.emit('worker:ready', worker);
					return;
				case WorkerEvent.ERROR:
					Log.label('WorkerPool').error(`Worker #${worker.id} has thrown a non-critical error: ${result.error?.message}`);
					return;
				case WorkerEvent.JOB_SUCCESS:
					this.emit('worker:success', worker, result);
					break;
				case WorkerEvent.JOB_RETRY:
					this.emit('worker:retry', worker, result);
					break;
				case WorkerEvent.JOB_ERROR:
					this.emit('worker:failed', worker, result);
					break;
			}

			this.emit('worker:available', worker);
		});

		// Only for the Worker itself crashing; Job errors come through "message".
		const onCrash = (error?: Error) => {
			if (this.terminating || !this.workers.includes(worker)) {
				return;
			}

			Log.label("WorkerPool").exception(`Worker #${worker.id} has crashed!`, error ?? new Error('exited'));

			this.emit('worker:error', worker, error);
			this.workers.splice(this.workers.indexOf(worker), 1);

			const freeIndex = this.freeWorkers.indexOf(worker);
			if (freeIndex !== -1) {
				this.freeWorkers.splice(freeIndex, 1);
			}

			// Delay so a worker that can't boot doesn't respawn in a tight loop
			setTimeout(() => {
				if (!this.terminating) {
					this.createWorker();
				}
			}, 1000).unref();
		};

		worker.on("error", onCrash);
		worker.on("exit", () => onCrash());

		this.workers.push(worker);
		this.emit('worker:created', worker);
	}

	public freeWorker(worker: TaskWorker) {
		worker.job = null;

		if (this.terminating || !this.workers.includes(worker)) {
			return;
		}

		this.freeWorkers.push(worker);
		this.emit('worker:freed', worker);
	}
}
