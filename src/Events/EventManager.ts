import {resolve} from "../AppContainer";
import {Classes, Log} from "../Common";
import {EventDispatcher} from "./EventDispatcher";
import {EventListener} from "./EventListener";

type EventModule<T> = {
	name: string;
	instance: new () => T;
}

type EventMap = {
	[key: string]: {
		eventName: string,
		listeners: EventListenerConstructor[]
	}
}

export type EventListenerConstructor = (new (...args: any[]) => EventListener)
export type EventDispatcherConstructor = (new (...args: any[]) => EventDispatcher)
export type DispatchEventName = (new (...args: any[]) => EventDispatcher) | string;

export class EventManager {

	private prepared: boolean = false;

	constructor(
		public dispatchers: EventModule<EventDispatcher>[],
		public listeners: EventModule<EventListener>[],
	) {}

	private eventMap: EventMap = {};

	/**
	 * Should not be called by developer
	 *
	 * This is used internally to register all of our dispatchers->listeners
	 */
	prepare(): void {
		if (this.prepared) return;

		for (let dispatcher of this.dispatchers) {
			const dispatcherInstance = new dispatcher.instance();

			if (!this.eventMap[dispatcher.name]) {
				this.eventMap[dispatcher.name] = {
					eventName : dispatcher.name,
					listeners : []
				};
			}

			this.eventMap[dispatcher.name].listeners.push(
				...dispatcherInstance.triggers()
			);
		}

		this.prepared = true;
	}

	/**
	 * Register an event dispatcher/string -> listener combo manually
	 *
	 * This method should only be used if you want to hook into framework events or have some custom logic.
	 *
	 * @param {{new(): EventDispatcher} | string} eventNameOrDispatcher
	 * @param {EventListenerConstructor} listener
	 */
	registerListener(eventNameOrDispatcher: (new () => EventDispatcher) | string, listener: EventListenerConstructor) {
		let eventName: string = '';

		if (typeof eventNameOrDispatcher !== 'string') {
			eventName = Classes.getConstructor(eventNameOrDispatcher).name;
		} else {
			eventName = eventNameOrDispatcher;
		}

		if (!this.eventMap[eventName]) {
			this.eventMap[eventName] = {
				eventName : eventName,
				listeners : []
			};
		}

		this.eventMap[eventName].listeners.push(listener);
	}

	/**
	 * Overload to allow the end developer to call dispatch a little easier
	 *
	 * @param {DispatchEventName} dispatcher
	 * @param {any[]} args
	 * @return {Promise<void>}
	 */
	static dispatch(dispatcher: DispatchEventName, args: any[]) : void {
		resolve(EventManager).dispatch(dispatcher, args);
	}

	/**
	 * Trigger all event listeners registered for this dispatcher/string
	 *
	 * @param {DispatchEventName} dispatcher
	 * @param {any[]} args
	 * @return {Promise<void>}
	 */
	async dispatch(dispatcher: DispatchEventName, args: any[]): Promise<void> {
		const dispatcherName = typeof dispatcher === 'string'
			? dispatcher
			: Classes.getConstructor(dispatcher).name;

		if (!this.eventMap[dispatcherName]) {
			Log.error(`Event Dispatched: ${dispatcherName}... but this dispatcher isn't registered somehow, triggers will not be called.`);
			return;
		}

		for (let listener of this.eventMap[dispatcherName].listeners) {
			try {
				const listenerInstance = new listener(...args);
				await listenerInstance.handle();
			} catch (error) {
				Log.exception(`Hit an error processing event listener: ${listener.name}`, error);
			}
		}

	}

}
