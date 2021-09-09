import {Worker} from "worker_threads";
import {FileLoader, Log} from "../Common";

let instance: WorkerPool = null;

export class WorkerPool {
	private readonly workers: Worker[] = [];
	private readonly freeWorkers: Worker[] = [];
	private readonly tasks: string[] = [];

	constructor() {
		if (instance) {
			return instance;
		}

		instance = this;

		for (let i = 0; i < 4; i++) {
			this.createWorker();
		}
	}

	public static getInstance() {
		if (!instance) {
			new WorkerPool();
		}

		return instance;
	}

	public hasCapacity() {
		return this.freeWorkers.length > 0 && this.tasks.length === 0;
	}

	runTask(jobData: string) {
		if (this.freeWorkers.length === 0) {
			this.tasks.push(jobData);
			return;
		}

		const worker = this.freeWorkers.shift();

		worker.postMessage(jobData);
	}

	private createWorker() {
		let worker: Worker;

		if (FileLoader.isTypescript()) {
			// For use whilst developing
			worker = new Worker(
				`const path=require('path');require('ts-node/register');require(path.join(process.cwd(), 'src', 'Queue', 'Worker.ts'));`,
				{eval: true},
			);
		} else {
			worker = new Worker(FileLoader.formatPathForRunEnvironment("./src/Queue/Worker.ts"));
		}

		worker.on("message", result => {
			this.freeWorkers.push(worker);
			this.onWorkerFreed();
		});
		worker.on("error", error => {
			Log.label("WorkerPool").error(error);

			this.workers.splice(this.workers.indexOf(worker), 1);
			this.createWorker();
		});

		this.workers.push(worker);
		this.freeWorkers.push(worker);

		this.onWorkerFreed();
	}

	private onWorkerFreed() {
		if (this.tasks.length > 0 && this.freeWorkers.length > 0) {
			this.runTask(this.tasks.shift());
		}
	}
}
