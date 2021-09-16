import {Exclude, Type} from "class-transformer";
import {ObjectId} from "mongodb";
import {Authenticatable} from "../../Authenticatable";
import {belongsTo, hasMany, hasOne, id, index, policy} from "../../Database";
import {UserPolicy} from "../Policies/UserPolicy";
import {Book} from "./Book";

@policy(UserPolicy)
@index('user-search', {name : 'text'})
export class User extends Authenticatable<User> {

	@id
	_id: ObjectId;

	@id
	someUserId: ObjectId | string;

	//	@hasOne(Book, 'userId', '_id')
	//	book?: Book;

	@hasMany('Book', 'userId', '_id')
	books?: Book;

	someCount: number;

	email: string;

	name: string = 'hello';

	something: string;

	nameTags: string[] = [];

	tags: string[] = [];

	orderValue: number;

	@Exclude()
	password: string;

	@hasOne('Book', 'userId', '_id')
	hasOneBook: Book;

	@id
	bookId: ObjectId;

	@belongsTo('Book', 'bookId', '_id')
	belongsToOneBook: Book;


}

