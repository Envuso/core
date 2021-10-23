import {classToPlainFromExist} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {ObjectId} from "mongodb";
import {injectable} from "tsyringe";
import {config, resolve} from "./AppContainer";
import {Authorization, ModelConstructorOrInstantiatedModel} from "./Authorization/Authorization";
import {AuthenticationContract} from "./Contracts/Authentication/AuthenticationContract";
import {JwtAuthenticationProviderContract} from "./Contracts/Authentication/AuthenticationProviders/JwtAuthenticationProviderContract";
import {AuthenticatableContract} from "./Contracts/Authentication/UserProvider/AuthenticatableContract";
import {WebSocketChannelListenerContractConstructor} from "./Contracts/WebSockets/WebSocketChannelListenerContract";
import {Model} from "./Database/Mongo/Model";
import {internalExclude} from "./Database/InternalDecorators";
import {WebSocketServer} from "./WebSockets/WebSocketServer";

@injectable()
export class Authenticatable<T> extends Model<T> implements AuthenticatableContract<T> {

	@internalExclude()
	public _user: any;

	public generateToken(additionalPayload?: any) {
		return resolve<AuthenticationContract>('Authentication')
			.getAuthProvider<JwtAuthenticationProviderContract>('JwtAuthenticationProvider')
			.issueToken((this as any)._id as unknown as string, additionalPayload);
	}

	public sendSocketChannelEvent(channel: WebSocketChannelListenerContractConstructor, eventName: string, data: any) {
		WebSocketServer.sendToUserViaChannel(this.getId().toString(), channel, eventName, data);
	}

	public sendSocketEvent(eventName: string, data: any) {
		WebSocketServer.sendToUserId(this.getId().toString(), eventName, data);
	}

	public setUser(user: any): AuthenticatableContract<T> {
		if (this._user && (user instanceof Authenticatable) && user._user) {
			user = user._user;
		}
		//		if (user instanceof Authenticatable && !this._user) {
		//			user = user._user;
		//		}

		Object.assign(this, user);
		this._user = user;

		return this;
	}

	public getUser<T>(): T {
		return this._user as T;
	}

	public getId(): ObjectId {
		return new ObjectId((this?._user?._id ?? (this as any)._id).toString());
	}

	public can<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional): Promise<boolean> {
		return Authorization.can<T>(permission, model, ...additional);
	}

	public cannot<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional): Promise<boolean> {
		return Authorization.cannot<T>(permission, model, ...additional);
	}

	public toJSON() {
		const options = config<any>('Server').responseSerialization as ClassTransformOptions;

		const obj = classToPlainFromExist(
			this._user ? this._user : this,
			{},
			options
		);

		if (this._user)
			Object.keys(obj).forEach(key => obj[key] = this[key]);

		return obj;
	}
}
