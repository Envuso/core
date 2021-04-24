import {Authenticatable} from "../../Common";
import {id, Model} from "../../Database";


export class User extends Authenticatable<User> {

	@id
	_id: string;

	something: string = 'hello';

}
