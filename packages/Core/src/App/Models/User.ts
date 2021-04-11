import {id, Model} from "@envuso/database";

export class User extends Model<User> {

	@id
	_id: string;

}
