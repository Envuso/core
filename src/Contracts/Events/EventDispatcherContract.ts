import {EventListenerContract} from "./EventListenerContract";

export interface EventDispatcherContract {triggers(): (new (...args: any[]) => EventListenerContract)[];}
