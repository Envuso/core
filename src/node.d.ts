declare module "http" {
	interface IncomingMessage {
		userId: string;
		connectionId: string;
	}
}
