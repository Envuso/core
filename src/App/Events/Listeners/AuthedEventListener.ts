import {EventListener} from "../../../Events/EventListener";

export class AuthedEventListener extends EventListener {
	constructor(public message: string) {
		super();
	}

	public async handle(): Promise<void | boolean> {
		console.log('Hi from AuthedEventListener, message: ', this.message);
	}
}
