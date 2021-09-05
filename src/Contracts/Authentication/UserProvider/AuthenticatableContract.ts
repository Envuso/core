import {ModelConstructorOrInstantiatedModel} from "../../../Authorization/Authorization";
import {SocketEvents} from "../../../Sockets/SocketEvents";
import {SocketChannelListenerContract} from "../../Sockets/SocketChannelListenerContract";

export interface AuthenticatableContract<T> {
	_user: any;

	generateToken(additionalPayload?: any): string;

	sendSocketChannelEvent(channel: new () => SocketChannelListenerContract, eventName: SocketEvents | string, data: any): void;

	sendSocketEvent(eventName: SocketEvents | string, data: any): void;

	setUser(user: any): AuthenticatableContract<T>;

	getUser<T>(): T;

	can<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional): Promise<boolean>;

	cannot<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional): Promise<boolean>;

	toJSON(): Record<string, any>;
}
