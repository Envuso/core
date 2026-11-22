export enum WorkerEvent {
	READY       = 'ready',
	ERROR       = 'error',
	JOB_SUCCESS = 'job:success',
	/** The job threw and will be retried after `retryInMs` */
	JOB_RETRY   = 'job:retry',
	/** The job threw (or could not be loaded) and will not be retried */
	JOB_ERROR   = 'job:error'
}

/** Sent from the queue to a worker thread */
export interface IWorkerTask {
	payload: string;
	attempts: number;
}

export interface IWorkerError {
	name: string;
	message: string;
	stack?: string;
}

export interface IWorkerResult {
	event: WorkerEvent;
	error?: IWorkerError;
	retryInMs?: number;
}
