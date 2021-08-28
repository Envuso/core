export abstract class EventListener {

	abstract handle(): Promise<void | boolean>

}
