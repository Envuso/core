import {EventListenerContract} from "../Contracts/Events/EventListenerContract";

export abstract class EventListener implements EventListenerContract {

	public abstract handle(): Promise<void | boolean>

}
