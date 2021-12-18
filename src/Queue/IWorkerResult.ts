export enum WorkerEvent {
	READY       = 'ready',
	ERROR       = 'error',
	JOB_SUCCESS = 'job:success',
	JOB_ERROR   = 'job:error'
}

export interface IWorkerJob {
	namespace: string;
	attempts: number;
	retries: number;
}

export interface IWorkerResult {
	event: WorkerEvent;
	error?: Error;
	job?: IWorkerJob;
}
