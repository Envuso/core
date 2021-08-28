import {EventDispatcher} from "../../../Events";
import {TestingEventListener} from "../Listeners/TestingEventListener";

export class TestingEventDispatcher extends EventDispatcher {

	public triggers() {
		return [
			TestingEventListener,
		]
	}

}
