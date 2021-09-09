export interface Queueable {
	handle(): Promise<void>;
}
