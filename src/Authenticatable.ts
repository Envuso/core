import {classToPlainFromExist, Exclude} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {injectable} from "tsyringe";
import {config, resolve} from "./AppContainer";
import {Authorization, ModelConstructorOrInstantiatedModel} from "./Authorization/Authorization";
import {AuthenticationContract} from "./Contracts/Authentication/AuthenticationContract";
import {JwtAuthenticationProviderContract} from "./Contracts/Authentication/AuthenticationProviders/JwtAuthenticationProviderContract";
import {AuthenticatableContract} from "./Contracts/Authentication/UserProvider/AuthenticatableContract";
import {SocketChannelListenerContract} from "./Contracts/Sockets/SocketChannelListenerContract";
import {Model} from "./Database/Mongo/Model";
import {SocketEvents} from "./Sockets/SocketEvents";
import {SocketServer} from "./Sockets/SocketServer";

@injectable()
export class Authenticatable<T> extends Model<T> implements AuthenticatableContract<T> {

	@Exclude()
	public _user: any;

	public generateToken(additionalPayload?: any) {
		return resolve<AuthenticationContract>('Authentication')
			.getAuthProvider<JwtAuthenticationProviderContract>('JwtAuthenticationProvider')
			.issueToken((this as any)._id as unknown as string, additionalPayload);
	}

	public sendSocketChannelEvent(channel: new () => SocketChannelListenerContract, eventName: SocketEvents | string, data: any) {
		resolve(SocketServer).sendToUserViaChannel(
			(this as any)._id.toString(), channel, eventName, data
		);
	}

	public sendSocketEvent(eventName: SocketEvents | string, data: any) {
		resolve(SocketServer).sendToUser(this._user._id.toString(), eventName, data);
	}

	public setUser(user: any): AuthenticatableContract<T> {
		if (user instanceof Authenticatable) {
			user = user._user;
		}

		Object.assign(this, user);
		this._user = user;

		return this;
	}

	public getUser<T>(): T {
		return this._user as T;
	}

	public can<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional): Promise<boolean> {
		return Authorization.can<T>(permission, model, ...additional);
	}

	public cannot<T extends ModelConstructorOrInstantiatedModel>(permission: string, model: T, ...additional): Promise<boolean> {
		return Authorization.cannot<T>(permission, model, ...additional);
	}

	public toJSON() {
		const options = config('Server').responseSerialization as ClassTransformOptions;

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
