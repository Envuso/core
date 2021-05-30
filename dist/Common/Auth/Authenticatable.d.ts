import { ModelConstructorOrInstantiatedModel } from "../../Authorization/Authorization";
import { Model } from "../../Database";
import { SocketEvents } from "../../Sockets/SocketEvents";
import { SocketChannelListener } from "../../Sockets/SocketChannelListener";
export declare class Authenticatable<T> extends Model<T> {
    private _user;
    generateToken(additionalPayload?: any): string;
    sendSocketChannelEvent(channel: new () => SocketChannelListener, eventName: SocketEvents | string, data: any): void;
    sendSocketEvent(eventName: SocketEvents | string, data: any): void;
    setUser(user: any): this;
    getUser<T>(): T;
    can<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional: any[]): Promise<boolean>;
    cannot<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional: any[]): Promise<boolean>;
    toJSON(): Record<string, any>;
}
