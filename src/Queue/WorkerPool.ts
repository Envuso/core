import EventEmitter from "events";
import {Worker} from "worker_threads";
import {FileLoader, Log} from "../Common";

let instance: WorkerPool = null;
const kWorkerReady       = Symbol('kWorkerReady');

export class WorkerPool extends EventEmitter {
	private readonly workers: Worker[]     = [];
	private readonly freeWorkers: Worker[] = [];

	constructor() {
		super();

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

	public getCapacity() {
		return this.freeWorkers.length;
	}

	public static getCapacity() {
		return this.getInstance().getCapacity();
	}

	runTask(jobData: string) {
		if (this.freeWorkers.length === 0) {
			return false;
		}

		const worker = this.freeWorkers.shift();

		worker.postMessage(jobData);

		return true;
	}

	private createWorker() {
		let worker: Worker;

		if (FileLoader.isTypescript()) {
			// For use whilst developing
			worker = new Worker(
				`const path=require('path');require('ts-node/register');require(path.join(process.cwd(), 'src', 'Queue', 'Worker.ts'));`,
				{eval : true},
			);
		} else {
			worker = new Worker(FileLoader.formatPathForRunEnvironment("./src/Queue/Worker.ts"));
		}

		worker.on("message", result => {
			if (result === '$$ready$$' && !worker[kWorkerReady]) {
				worker[kWorkerReady] = kWorkerReady;
			}

			this.emit('worker:freed', worker);
		});
		worker.on("error", error => {
			Log.label("WorkerPool").exception('Something broken', error);

			this.emit('worker:error', worker, error);

			this.workers.splice(this.workers.indexOf(worker), 1);
			this.createWorker();
		});

		this.workers.push(worker);

		this.emit('worker:created', worker);
	}

	public freeWorker(worker: Worker) {
		Log.label('WorkerPool').debug('Free Worker');

		this.freeWorkers.push(worker);
	}
}
