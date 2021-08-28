import {EventListener} from "../../../Events";

export class TestingEventListener extends EventListener {
	constructor(public message: string) {
		super();
	}

	public async handle(): Promise<void | boolean> {
		console.log('Hi from TestingEventListener, message: ', this.message);
	}
}
