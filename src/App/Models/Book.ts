import {ObjectId} from "mongodb";
import {id, Model} from "../../Database";


export class Book extends Model<Book> {

	@id
	_id: ObjectId;

	@id
	userId: ObjectId;

	title: string;
}
