import {ObjectId} from "mongodb";
import {Authenticatable} from "../../Common";
import {id, Model} from "../../Database";


export class User extends Authenticatable<User> {

	@id
	_id: ObjectId;

	something: string = 'hello';

}
