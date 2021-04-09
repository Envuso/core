export class FailedToBindException extends Error {

	constructor(binding : any) {
		super("Cannot bind to the container");
		console.error(binding);
	}

}
