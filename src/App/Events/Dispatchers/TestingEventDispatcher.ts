import {EventDispatcher} from "../../../Events/EventDispatcher";
import {TestingEventListener} from "../Listeners/TestingEventListener";

export class TestingEventDispatcher extends EventDispatcher {

	public triggers() {
		return [
			TestingEventListener,
		];
	}

}
