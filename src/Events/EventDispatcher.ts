import {resolve} from "../AppContainer";
import {Classes} from "../Common";
import {EventListener} from "./EventListener";
import {EventManager} from "./EventManager";

export abstract class EventDispatcher {

	/**
	 * Trigger all of the event listeners
	 * We can also pass arguments to this method, they will be injected into
	 * the event listeners constructor.
	 *
	 * @param args
	 */
	public static dispatch(...args: any[]): void {
		resolve(EventManager).dispatch(
			Classes.getConstructor(this), args
		);
	}

	/**
	 * Set an array of event listeners for this handler.
	 *
	 * When the event is dispatched, all of the defined event listeners will be called.
	 *
	 * @return {{new(): EventListener}[]}
	 */
	public abstract triggers(): (new (...args: any[]) => EventListener)[];

}
