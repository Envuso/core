import {Exclude} from "class-transformer";
import {ObjectId} from "mongodb";
import {Authenticatable} from "../../Authenticatable";
import {belongsTo, hasMany, hasOne, id, policy} from "../../Database";
import {UserPolicy} from "../Policies/UserPolicy";
import {Book} from "./Book";

@policy(UserPolicy)
export class User extends Authenticatable<User> {

	@id
	_id: ObjectId;

	@id
	someUserId: ObjectId | string;

//	@hasOne(Book, 'userId', '_id')
//	book?: Book;

	@hasMany(Book, 'userId', '_id')
	books?: Book;

	someCount : number = 1;

	email: string;

	name: string = 'hello';

	something: string = 'hello';

	orderValue: number;

	@Exclude()
	password: string;


	@belongsTo('Book', '_id', 'bookId')
	book: Book;

}
