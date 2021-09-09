export interface QueueConfiguration {
	// Period to wait between polling for Jobs
	emptyWaitTimeMs: number;
	// Period to wait when there are more Jobs waiting then can fit in the current batch
	fullWaitTimeMs: number;
}
