import {Exclude} from "class-transformer";
import {ObjectId} from "mongodb";
import {Authenticatable} from "../../Common";
import {id} from "../../Database";


export class User extends Authenticatable<User> {

	@id
	_id: ObjectId;

	@id
	someUserId: ObjectId;

	email: string;

	something: string = 'hello';

	orderValue: number;

	@Exclude()
	password: string;

}
