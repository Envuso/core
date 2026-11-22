import type {DispatchEventName, EventListenerConstructor, EventMap, EventModule} from "../../Events/EventManager";
import {EventDispatcher} from "../../Events/EventDispatcher";
import {EventListener} from "../../Events/EventListener";
import type {EventDispatcherContract} from "./EventDispatcherContract";

export interface EventManagerContract {
	prepared: boolean;
	dispatchers: EventModule<EventDispatcher>[];
	listeners: EventModule<EventListener>[];
	eventMap: EventMap;

	/**
	 * Should not be called by developer
	 *
	 * This is used internally to register all of our dispatchers->listeners
	 */
	prepare(): void;

	/**
	 * Register an event dispatcher/string -> listener combo manually
	 *
	 * This method should only be used if you want to hook into framework events or have some custom logic.
	 *
	 * @param {{new(): EventDispatcher} | string} eventNameOrDispatcher
	 * @param {EventListenerConstructor} listener
	 */
	registerListener(eventNameOrDispatcher: (new () => EventDispatcherContract) | string, listener: EventListenerConstructor): void;

	/**
	 * Trigger all event listeners registered for this dispatcher/string
	 *
	 * @param {DispatchEventName} dispatcher
	 * @param {any[]} args
	 * @return {Promise<void>}
	 */
	dispatch(dispatcher: DispatchEventName, args: any[]): Promise<void>;
}
