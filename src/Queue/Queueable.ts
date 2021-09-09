export interface BaseQueueable extends Queueable {
	serialize(): string;
}

export interface Queueable {
	handle(): Promise<void>;
}
