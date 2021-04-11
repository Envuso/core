import {ObjectId} from "mongodb";
import {id} from "../../ModelDecorators";
import {Model} from "../../Mongo/Model";

export class UserModel extends Model<UserModel> {
	@id
	_id: ObjectId;

	something: string = 'hello';
}
