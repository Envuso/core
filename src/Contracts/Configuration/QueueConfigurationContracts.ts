export interface QueueConfiguration {
	/** Redis key namespace for this queue */
	name: string;
	/** Worker threads to process jobs with. 0 = this process only dispatches */
	workers: number;
	/** How long to wait between polls when there's nothing to do */
	waitTimeMs: number;
	/**
	 * How long a job's reservation lasts. Running jobs keep extending it; it only
	 * expires when the process dies, and then the job is retried after this long.
	 */
	visibilityTimeoutMs: number;
}
