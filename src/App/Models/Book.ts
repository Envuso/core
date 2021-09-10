import {Type} from "class-transformer";
import {ObjectId} from "mongodb";
import {belongsTo, id, Model} from "../../Database";
import {User} from "./User";


export class Book extends Model<Book> {

	@id
	_id: ObjectId;


	title: string;

	@Type(() => Array)
	tags: string[];

	@id
	userId: ObjectId;

//	@belongsTo('User', 'userId', '_id')
	user: User;
}
