import {Exclude} from "class-transformer";
import {id, Model} from "../../Database";


export class User extends Model<User> {

	@id
	_id: string;

	something: string = 'hello';

}
