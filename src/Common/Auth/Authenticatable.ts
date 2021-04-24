import {classToPlainFromExist, Exclude} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {config, resolve} from "../../AppContainer";
import {Authentication, JwtAuthenticationProvider} from "../../Authentication";
import {Model} from "../../Database";

export class Authenticatable<T> extends Model<T> {

	@Exclude()
	private _user: any;

	generateToken() {
		return resolve(Authentication)
			.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider)
			.issueToken((this as any)._id as unknown as string);
	}

	setUser(user: any) {
		Object.assign(this, user);
		this._user = user;

		return this;
	}

	toJSON() {
		const options = config('server.responseSerialization') as ClassTransformOptions;

		const obj = classToPlainFromExist(
			this._user ? this._user : this,
			{},
			options
		);

		if(this._user)
			Object.keys(obj).forEach(key => obj[key] = this[key]);

		return obj;
	}
}
