import {DateTime} from "@envuso/date-time-helper";
import {App} from "../AppContainer/App";
import {Log} from "../Common/Logger/Log";
import type {QueueConfiguration} from "../Contracts/Configuration/QueueConfigurationContracts";
import type {IWorkerResult} from "./IWorkerResult";
import {Job} from "./Jobs/Job";
import {QueueStore} from "./QueueStore";
import {TaskWorker, WorkerPool} from "./WorkerPool";

let instance: Queue = null;

const defaults: QueueConfiguration = {
	name                : 'queue',
	workers             : 1,
	waitTimeMs          : 1_000,
	visibilityTimeoutMs : 5 * 60_000,
};

/**
 * Dispatching only needs Redis: `Queue.dispatch(job)` works in any process.
 * Processing runs in `run()`, which starts `workers` worker threads; any number
 * of processes can run() against the same Redis, each job runs on one of them.
 */
export class Queue {
	private readonly config: QueueConfiguration;
	private readonly store: QueueStore;
	private pool: WorkerPool  = null;
	private running           = false;
	private stopped: Promise<void>;
	private wake: () => void = null;

	constructor(config: Partial<QueueConfiguration> = {}) {
		if (instance) {
			return instance;
		}

		this.config = {...defaults, ...config};
		this.store  = new QueueStore(this.config.name);

		instance = this;
	}

	static getInstance() {
		return instance;
	}

	public getStore(): QueueStore {
		return this.store;
	}

	/**
	 * Start processing jobs until stop() is called or the app unloads.
	 */
	public run(): Promise<void> {
		if (this.running) {
			return this.stopped;
		}
		if (this.config.workers <= 0) {
			return Promise.resolve();
		}

		this.running = true;
		this.pool    = new WorkerPool(this.config.workers);

		this.pool.on('worker:ready', worker => this.onWorkerAvailable(worker));
		this.pool.on('worker:available', worker => this.onWorkerAvailable(worker));
		this.pool.on('worker:success', worker => this.settle(worker, () => this.store.ack(worker.job.id)));
		this.pool.on('worker:retry', (worker, result: IWorkerResult) => this.settle(
			worker, () => this.store.release(worker.job.id, Date.now() + (result.retryInMs ?? 0))
		));
		this.pool.on('worker:failed', (worker, result: IWorkerResult) => this.settle(
			worker, () => this.store.fail(worker.job.id, result.error?.stack ?? result.error?.message ?? 'Unknown error')
		));
		this.pool.on('worker:error', (worker: TaskWorker) => {
			// The thread crashed mid-job; the attempt counts, retry it now
			if (worker.job) {
				this.store.release(worker.job.id).catch(error => Log.label('Queue').exception('Could not release job', error));
			}
		});

		this.stopped = this.loop();

		return this.stopped;
	}

	/**
	 * Stop taking jobs and shut the workers down. Jobs that were mid-run are
	 * picked up again once their reservation expires.
	 */
	public async stop() {
		if (!this.running) {
			return;
		}

		this.running = false;
		this.wake?.();

		await this.stopped;
		await this.pool?.terminate();
		this.pool = null;
	}

	public static async shutdown() {
		await instance?.stop();
		instance = null;
	}

	public static async dispatch(job: Job) {
		if (!job.hasDelay()) {
			await this.push(job);
		} else {
			await this.later(job, job.delayUntil);
		}

		const {namespace} = Reflect.getMetadata("job", job.constructor);

		Log.label("Queue").info(`Queued: ${namespace}`);
	}

	/**
	 * Push a Job onto the Queue so it can be processed.
	 */
	public static push(job: Job) {
		return this.queueStore().push(job.id, job.serialize());
	}

	/**
	 * Push a Job onto the Queue so it is processed at `delayUntil`.
	 */
	public static later(job: Job, delayUntil: DateTime) {
		return this.queueStore().push(job.id, job.serialize(), delayUntil.toTime());
	}

	private static queueStore(): QueueStore {
		return (instance ?? new Queue()).store;
	}

	private async loop() {
		while (this.running && App.isBooted()) {
			// Only wait when there was nothing to pick up; sleeping after every pass capped
			// short jobs at about one per worker per second
			let reserved = 0;

			try {
				// Keep the reservations of running jobs alive
				await this.store.extend(
					this.pool.runningJobs().map(job => job.id),
					Date.now() + this.config.visibilityTimeoutMs
				);

				const capacity = this.pool.getCapacity();
				const jobs     = capacity > 0 ? await this.store.reserve(capacity, this.config.visibilityTimeoutMs) : [];
				reserved       = jobs.length;

				for (const job of jobs) {
					if (!this.pool.runTask(job)) {
						await this.store.unreserve(job.id);
					}
				}
			} catch (error) {
				Log.label('Queue').exception('Queue loop error', error);
			}

			if (reserved === 0) {
				await this.sleep(this.config.waitTimeMs);
			}
		}

		this.running = false;
	}

	private sleep(ms: number) {
		return new Promise<void>(resolve => {
			const timer = setTimeout(done, ms);

			function done() {
				clearTimeout(timer);
				resolve();
			}

			this.wake = done;
		});
	}

	/*
	 Worker Events
	 */

	private async settle(worker: TaskWorker, action: () => Promise<unknown>) {
		try {
			await action();
		} catch (error) {
			Log.label('Queue').exception('Could not update job state', error);
		}
	}

	private async onWorkerAvailable(worker: TaskWorker) {
		// Wait for the result of the previous job to be stored before reusing the worker
		await new Promise(resolve => setImmediate(resolve));

		try {
			const [job] = this.running ? await this.store.reserve(1, this.config.visibilityTimeoutMs) : [];

			if (job) {
				// Have the Worker run another Job right away.
				if (!worker.runImmediate(job)) {
					await this.store.unreserve(job.id);
				}
				return;
			}
		} catch (error) {
			Log.label('Queue').exception('Could not reserve job', error);
		}

		// Mark the Worker as available so the Queue can use it on its next loop.
		worker.free();
	}
}
