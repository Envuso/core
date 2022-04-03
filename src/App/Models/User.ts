import {Exclude, Type} from "class-transformer";
import {ObjectId} from "mongodb";
import {Authenticatable} from "../../Authenticatable";
import {belongsTo, date, hasMany, hasOne, id, index, policy} from "../../Database";
import {hook} from "../../Database/ModelHooks";
import {UserPolicy} from "../Policies/UserPolicy";
import {Book} from "./Book";

@policy(UserPolicy)
@index('user-search', {name : 'text'})
export class User extends Authenticatable<User> {

	@id
	_id: ObjectId;

	@id
	someUserId: ObjectId | string;

	@hasOne('User', '_id', 'someUserId')
	someUser: User;

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

	booleanValue: boolean;

	orderValue: number;

	@Exclude()
	password: string;

	@hasOne('Book', 'userId', '_id')
	hasOneBook: Book;

	@id
	bookId: ObjectId;

	@belongsTo('Book', 'bookId', '_id')
	belongsToOneBook: Book;


	@hasMany('Book', 'userId', '_id', {_id : -1})
	booksDesc: Book[];

	@hasMany('Book', 'userId', '_id', {_id : 1})
	booksAsc: Book[];


	@id
	objectIdArr: ObjectId[]                             = [];
	@id
	objectIdObj: { id?: ObjectId, deeper?: ObjectId[] } = {};

	@id
	annoyingRelationIds: { id: ObjectId }[] = [];

	@hasMany('Book', '_id', 'annoyingRelationIds.id')
	annoyingRelation: Book[];

	someOrderingTimestamp: Date;

	updatingNestedObject: { something?: { else: boolean }, and?: { another: { thing: boolean } } } = {};

	@date()
	someRandomDate: Date;

	@date()
	createdAt: Date;
	@date()
	updatedAt: Date;

	@hook
	async beforeCreate(user: User) {
		user.createdAt = new Date();

		return user;
	}

	@hook
	async beforeSave(user: User) {
		user.updatedAt = new Date();

		return user;
	}

	hasManyBooksRelation() {
		return this.hasMany(Book, '_id', 'userId')
	}

}

