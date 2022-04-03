import "reflect-metadata";
import 'jest-extended';
import {Book} from "../../App/Models/Book";
import {User} from "../../App/Models/User";
import {AuthenticationServiceProvider} from "../../Authentication";
import {AuthorizationServiceProvider} from "../../Authorization/AuthorizationServiceProvider";
import {EncryptionServiceProvider} from "../../Crypt";
import {Database} from "../../Database";
import {EventServiceProvider} from "../../Events";
import {InertiaServiceProvider} from "../../Packages/Inertia/InertiaServiceProvider";
import {RouteServiceProvider} from "../../Routing/RouteServiceProvider";
import {SecurityServiceProvider} from "../../Security/SecurityServiceProvider";
import {SessionServiceProvider} from "../../Session/SessionServiceProvider";
import {StorageServiceProvider} from "../../Storage";
import {bootApp, unloadApp} from "../preptests";


describe('model relationships', () => {

	beforeAll(() => bootApp(false, [
		SecurityServiceProvider,
		SessionServiceProvider,
		EventServiceProvider,
		EncryptionServiceProvider,
		AuthenticationServiceProvider,
		AuthorizationServiceProvider,
		RouteServiceProvider,
		StorageServiceProvider,
		InertiaServiceProvider,
	]));

	afterAll(async () => {
		await Database.dropCollection('users');
		await unloadApp(false);
	});


	test('has many relationship', async () => {

		const bruce = await User.create({name : 'bruce'});

		await Book.insertMany([
			{userId : bruce._id, title : 'One of bruce\'s books'},
			{userId : bruce._id, title : 'Another one of bruce\'s books'},
		]);

		const bruceWithBooks = await User.query()
			.where({_id : bruce._id})
			.with('books')
			.first();

		expect(bruceWithBooks.books).toHaveLength(2);
		expect(bruceWithBooks.books[0]).toBeInstanceOf(Book);
	});

	test('has many relationship via this.hasMany', async () => {
		const bruce    = await User.create({name : 'bruce'});
		const booksRes = await Book.insertMany([
			{userId : bruce._id, title : 'One of bruce\'s books'},
			{userId : bruce._id, title : 'Another one of bruce\'s books'},
		]);

		const book = await bruce.hasManyBooksRelation()
			.where('title', 'One of bruce\'s books')
			.first();

		expect(booksRes.ids[0]).toEqual(book._id);
	});

	test('has many relation with multiple models at once', async () => {

		await User.insertMany([
			{name : 'Bruce one'},
			{name : 'Bruce two'},
		]);

		const bruceOne = await User.find('Bruce one', 'name');
		const bruceTwo = await User.find('Bruce two', 'name');


		await Book.insertMany([
			{userId : bruceOne._id, title : `Book 1 from bruceOne`},
			{userId : bruceOne._id, title : `Book 2 from bruceOne`},
			{userId : bruceTwo._id, title : `Book 1 from bruceTwo`},
			{userId : bruceTwo._id, title : `Book 2 from bruceTwo`},
		]);

		const brucesWithBooks = await User.query()
			.whereIn('name', ['Bruce one', 'Bruce two'])
			.with('books')
			.get();

		expect(brucesWithBooks[0].books).toBeDefined();
		expect(brucesWithBooks[0].books).toBeArray();
		expect(brucesWithBooks[0].books[0]).toBeInstanceOf(Book);

	});

	test('has one relationship', async () => {

		const bruce = await User.create({name : 'bruce'});

		await Book.insertMany([
			{userId : bruce._id, title : 'One of bruce\'s books'},
			{userId : bruce._id, title : 'Another one of bruce\'s books'},
		]);

		const bruceWithBooks = await User.query()
			.where({_id : bruce._id})
			.with('hasOneBook')
			.first();

		expect(bruceWithBooks.hasOneBook).toBeDefined();
		expect(bruceWithBooks.hasOneBook).toBeObject();
		expect(bruceWithBooks.hasOneBook).toBeInstanceOf(Book);
	});

	test('load with has one/many relationship', async () => {

		const bruce = await User.create({name : 'bruce'});

		await Book.insertMany([
			{userId : bruce._id, title : 'One of bruce\'s books'},
			{userId : bruce._id, title : 'Another one of bruce\'s books'},
		]);

		await bruce.load('books', 'hasOneBook');

		expect(bruce.hasOneBook).toBeDefined();
		expect(bruce.hasOneBook).toBeObject();
		expect(bruce.hasOneBook).toBeInstanceOf(Book);

		expect(bruce.books).toHaveLength(2);
		expect(bruce.books[0]).toBeInstanceOf(Book);
	});

	test('belongs to relationship', async () => {

		const bruce = await User.create({name : 'bruce'});
		const book  = await Book.create({userId : bruce._id, title : 'One of bruce\'s books'});

		bruce.bookId = book._id;
		await bruce.save();

		const bruceWithBooks = await User.query()
			.where({_id : bruce._id})
			.with('belongsToOneBook')
			.first();

		expect(bruceWithBooks.belongsToOneBook).toBeDefined();
		expect(bruceWithBooks.belongsToOneBook).toBeObject();
		expect(bruceWithBooks.belongsToOneBook).toBeInstanceOf(Book);

	});

	test('many relation with order clause', async () => {

		const bruce = await User.create({name : 'bruce'});

		await Book.insertMany([
			{userId : bruce._id, title : 'One of bruce\'s books'},
			{userId : bruce._id, title : 'Another one of bruce\'s books'},
		]);

		const bruceWithBooks = await User.query()
			.where({_id : bruce._id})
			.with('booksDesc', 'booksAsc')
			.first();

	});

	test('saving model with many related model data loaded', async () => {

		const bruce = await User.create({name : 'bruce'});


		await Book.insertMany([
			{userId : bruce._id, title : 'One of bruce\'s books'},
			{userId : bruce._id, title : 'Another one of bruce\'s books'},
		]);

		expect(bruce.books).toBeFalsy();

		await bruce.load('books');
		await bruce.save();

		const bru = await User.find(bruce._id);

		expect(bru.books).toBeFalsy();

	});

	test('saving model with single related model data loaded', async () => {

		const bruce = await User.create({name : 'bruce'});
		await Book.insertMany([
			{userId : bruce._id, title : 'One of bruce\'s books'},
			{userId : bruce._id, title : 'Another one of bruce\'s books'},
		]);

		expect(bruce.hasOneBook).toBeFalsy();

		await bruce.load('hasOneBook');
		await bruce.save();

		const bru = await User.find(bruce._id);

		expect(bru.hasOneBook).toBeFalsy();

	});

});
