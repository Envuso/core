import {classToPlainFromExist, Exclude} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces";
import {ObjectId} from "mongodb";
import {config, resolve} from "../../AppContainer";
import {Authentication, JwtAuthenticationProvider} from "../../Authentication";
import {id, Model} from "../../Database";

export class Authenticatable extends Model<Authenticatable> {

	@Exclude()
	private _user: any;

	@id
	_id: ObjectId;

	generateToken() {
		return resolve(Authentication)
			.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider)
			.issueToken(this._id as unknown as string);
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
