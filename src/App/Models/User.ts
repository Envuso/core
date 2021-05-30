import {Exclude} from "class-transformer";
import {ObjectId} from "mongodb";
import {Authenticatable} from "../../Common";
import {id, policy} from "../../Database";
import {UserPolicy} from "../Policies/UserPolicy";


@policy(UserPolicy)
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
