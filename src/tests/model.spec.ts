import "reflect-metadata";
import {ObjectId} from "mongodb";
import {Book} from "../App/Models/Book";
import {User} from "../App/Models/User";
import {App} from "../AppContainer";
import {Str} from "../Common";
import {Arr} from "../Common/Utility/Arr";
import {Server} from "../Server/Server";
import {bootApp, unloadApp} from "./preptests";


beforeAll(() => bootApp());
afterAll(() => unloadApp());


describe('models', () => {

	test('model can use be initiated', async () => {

		const m     = new User();
		m.something = 'lel';

		expect(m).toBeInstanceOf(User);
	});

	test('model can be saved', async () => {

		const m     = new User();
		m.something = 'reee';
		await m.save();

		expect(m._id).toBeDefined();
	});

	test('model can be updated', async () => {
		const m     = new User();
		m.something = 'lol';
		await m.save();

		expect(m.something).toBe('lol');

		const model = await User.find<User>(m._id);
		await model.update({something : 'lel'});

		expect(m._id).toBeDefined();
		expect(model.something).toBe('lel');
	});

	test('model where first', async () => {
		const user = await User
			.where<User>({something : 'lel'})
			.first();

		expect(user).toBeDefined();
	});

	test('model find', async () => {
		const user = await User.findOne<User>({something : 'lel'});

		expect(user).toBeDefined();
	});

	test('model create', async () => {
		const user = await User.create({
			something : '12345789'
		});

		expect(user).toBeInstanceOf(User);
		expect(user.something).toEqual('12345789');
		expect(await user.delete()).toBeTruthy();
	});

	test('updating a model via .save()', async () => {
		const random       = Str.random();
		const secondRandom = Str.random();

		const user = await User.create({something : random});

		user.something = secondRandom;
		await user.save();

		const foundUser = await User.find(secondRandom, 'something');

		expect(user._id).toBeDefined();
		expect(user._id).toEqual(foundUser._id);
		expect(await user.delete()).toBeTruthy();
		expect(await foundUser.delete()).toBeTruthy();

	});

	test('updating a model via .update()', async () => {
		const random       = Str.random();
		const secondRandom = Str.random();

		const user = await User.create({something : random});

		const updated = await user.update({
			something : secondRandom
		});

		expect(updated.something).toEqual(secondRandom);
		expect(updated._id).toEqual(updated._id);

		const foundUser = await User.find(secondRandom, 'something');

		expect(user.something).toEqual(secondRandom);
		expect(user._id).toEqual(foundUser._id);
		expect(await foundUser.delete()).toBeTruthy();
	});

	test('using save on document with @excluded properties, arent removed', async () => {

		const user      = new User();
		user.orderValue = 1;
		user.something  = 'hello';
		user.email      = 'hello@hello.test';
		user.password   = 'helloworld';
		await user.save();


		const retrievedUser = await User.where({
			_id : user._id
		}).first();

		expect(user.password).toEqual('helloworld');
		expect(retrievedUser.password).toEqual('helloworld');
	});

	test('using .save() with multiple @id decorators', async () => {

		const otherUser = await User.create({something : "randomtext"});

		const user      = new User();
		user.someUserId = otherUser._id.toHexString();
		await user.save();

		expect(otherUser._id).toBeDefined();
		expect(otherUser._id).toBeInstanceOf(ObjectId);
		expect(user._id).toBeDefined();

		expect(user.someUserId).toBeDefined();
		expect(user.someUserId).toEqual(otherUser._id);
		expect(user.someUserId).toBeInstanceOf(ObjectId);

		const storedUser = await User.find(user._id);

		expect(user.someUserId).toBeDefined();
		expect(user.someUserId).toEqual(otherUser._id);
		expect(user.someUserId).toBeInstanceOf(ObjectId);
	});

	test('test regular paginating', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/model/pagination',
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		const json = res.json();

		expect(json.data).toBeDefined();
		expect(res).toBeDefined();

	});

	test('test paginating with filter', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/model/pagination/filtered',
			headers : {
				"content-type" : "application/json",
				"accept"       : "application/json",
			}
		});

		const json = res.json();

		expect(json.data).toBeDefined();
		expect(res).toBeDefined();

	});

	test('saving a model with multiple @id tags', async () => {
		const user      = new User();
		user.someUserId = '612a174610a40c9afced1136';
		await user.save();

		expect(user.someUserId).toBeInstanceOf(ObjectId);
	});

	test('using optional where chaining', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const count = await User
			.when(false, {something : 'hello'})
			.where({_id : 'dsjfksdjk'})
			.count();

		expect(count).toEqual(0);

		const countTwo = await User
			.where({something : 'jdfkjsdjflsjdlfjsldjlfjsdkljfsdljfsd'})
			.when(true, {something : 'hello'})
			.count();

		expect(countTwo).toBeGreaterThan(0);
	});

	test('using where in', async () => {
		const results    = await User.whereIn('something', ['hello']).get();
		const resultsTwo = await User.whereIn('something', ['hello', 'reee']).get();

		expect(Arr.unique(results.map(r => r.something))).toHaveLength(1);
		expect(Arr.unique(resultsTwo.map(r => r.something))).toHaveLength(2);
	});

	test('circular reference issue with regular mongo query', async () => {

		const users = await User.where({something : 'new hello'}).get();

		const q = await User.getCollection().updateMany({
			something : 'new hello',
		}, {
			$set : {something : 'newer hello'}
		});

	});

	test('all object id values to be okay after toBSON() serialization', async () => {

		const user = await User.create({
			something  : 'sdjdask',
			someUserId : new ObjectId('6137cb8fb7c3be2ee73fc6f0'),
		});

		expect(user._id).toBeInstanceOf(ObjectId);
		expect(user.someUserId).toBeInstanceOf(ObjectId);

		const userTwoTest = await User.create({
			something  : 'sdjdask',
			someUserId : '6137cb8fb7c3be2ee73fc6f0',
		});

		expect(userTwoTest._id).toBeInstanceOf(ObjectId);
		expect(userTwoTest.someUserId).toBeInstanceOf(ObjectId);

	});

	test('insert many query', async () => {

		let insertResults = await User.insertMany([
			{something : 'yeeteriono'},
			{something : 'yeeteriono numbah two'},
		]);

		expect(insertResults.success).toBe(true);
		expect(insertResults.ids).toHaveLength(2);


		const bruce     = new User();
		bruce.something = 'bruce';

		const sally     = new User();
		sally.something = 'sally';

		insertResults = await User.insertMany([bruce, sally]);

		expect(insertResults.success).toBe(true);
		expect(insertResults.ids).toHaveLength(2);


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


		debugger;

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
			.with('books')
			.first();

		expect(bruceWithBooks.book).toBeDefined();
		expect(bruceWithBooks.book).toBeObject();
		expect(bruceWithBooks.book).toBeInstanceOf(Book);
	});


});

