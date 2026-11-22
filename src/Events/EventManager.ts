import {resolve} from "../AppContainer/helpers";
import {Classes} from "../Common/Utility/Classes";
import {Log} from "../Common/Logger/Log";
import type {EventDispatcherContract} from "../Contracts/Events/EventDispatcherContract";
import type {EventListenerContract} from "../Contracts/Events/EventListenerContract";
import type {EventManagerContract} from "../Contracts/Events/EventManagerContract";

export type EventModule<T> = {
	name: string;
	instance: new () => T;
}

export type EventMap = {
	[key: string]: {
		eventName: string,
		listeners: EventListenerConstructor[]
	}
}

export type EventListenerConstructor = (new (...args: any[]) => EventListenerContract)
export type EventDispatcherConstructor = (new (...args: any[]) => EventDispatcherContract)
export type DispatchEventName = (new (...args: any[]) => EventDispatcherContract) | string;

export class EventManager implements EventManagerContract {

	public prepared: boolean = false;

	constructor(
		public dispatchers: EventModule<EventDispatcherContract>[],
		public listeners: EventModule<EventListenerContract>[],
	) {}

	/**
	 * Listeners by event name: string events, and dispatcher classes by their name
	 */
	public eventMap: EventMap = {};

	/**
	 * Listeners by dispatcher class. Dispatching a class uses this, so two dispatcher
	 * classes with the same name (in different folders) no longer share listeners.
	 */
	private byDispatcher = new Map<Function, EventListenerConstructor[]>();

	private addListeners(eventNameOrDispatcher: Function | string, listeners: EventListenerConstructor[]) {
		const eventName = typeof eventNameOrDispatcher === 'string' ? eventNameOrDispatcher : eventNameOrDispatcher.name;

		if (typeof eventNameOrDispatcher !== 'string') {
			const existing = [...this.byDispatcher.keys()].find(d => d !== eventNameOrDispatcher && d.name === eventName);
			if (existing) {
				Log.warn(`Two event dispatchers are named "${eventName}". Dispatch them by class; dispatching by the name "${eventName}" reaches both.`);
			}

			this.byDispatcher.set(eventNameOrDispatcher, [...(this.byDispatcher.get(eventNameOrDispatcher) ?? []), ...listeners]);
		}

		if (!this.eventMap[eventName]) {
			this.eventMap[eventName] = {eventName, listeners : []};
		}

		this.eventMap[eventName].listeners.push(...listeners);
	}

	/**
	 * Should not be called by developer
	 *
	 * This is used internally to register all of our dispatchers->listeners
	 */
	public prepare(): void {
		if (this.prepared) return;

		for (let dispatcher of this.dispatchers) {
			const dispatcherInstance = new dispatcher.instance();

			this.addListeners(dispatcher.instance, dispatcherInstance.triggers());
		}

		this.prepared = true;
	}

	/**
	 * Register an event dispatcher/string -> listener combo manually
	 *
	 * This method should only be used if you want to hook into framework events or have some custom logic.
	 *
	 * @param {{new(): EventDispatcherContract} | string} eventNameOrDispatcher
	 * @param {EventListenerConstructor} listener
	 */
	public registerListener(eventNameOrDispatcher: (new () => EventDispatcherContract) | string, listener: EventListenerConstructor) {
		this.addListeners(
			typeof eventNameOrDispatcher === 'string' ? eventNameOrDispatcher : Classes.getConstructor(eventNameOrDispatcher),
			[listener]
		);
	}

	/**
	 * Overload to allow the end developer to call dispatch a little easier
	 *
	 * @param {DispatchEventName} dispatcher
	 * @param {any[]} args
	 * @return {Promise<void>}
	 */
	static dispatch(dispatcher: DispatchEventName, args: any[]): Promise<void> {
		return resolve(EventManager).dispatch(dispatcher, args);
	}

	/**
	 * Trigger all event listeners registered for this dispatcher/string
	 *
	 * @param {DispatchEventName} dispatcher
	 * @param {any[]} args
	 * @return {Promise<void>}
	 */
	public async dispatch(dispatcher: DispatchEventName, args: any[]): Promise<void> {
		const dispatcherClass = typeof dispatcher === 'string' ? null : Classes.getConstructor(dispatcher);
		const dispatcherName  = dispatcherClass ? dispatcherClass.name : dispatcher as string;
		const listeners       = dispatcherClass
			? this.byDispatcher.get(dispatcherClass)
			: this.eventMap[dispatcherName]?.listeners;

		if (!listeners) {
			Log.error(`Event Dispatched: ${dispatcherName}... but this dispatcher isn't registered somehow, triggers will not be called.`);
			return;
		}

		for (let listener of listeners) {
			try {
				const listenerInstance = new listener(...args);
				await listenerInstance.handle();
			} catch (error) {
				Log.exception(`Hit an error processing event listener: ${listener.name}`, error);
			}
		}

	}

}
