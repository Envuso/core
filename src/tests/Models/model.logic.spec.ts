import "reflect-metadata";
import 'jest-extended';
import {ObjectId} from "mongodb";

import {Book} from "../../App/Models/Book";
import {User} from "../../App/Models/User";
import {app} from "../../AppContainer";
import {AuthenticationServiceProvider} from "../../Authentication";
import {AuthorizationServiceProvider} from "../../Authorization/AuthorizationServiceProvider";
import {EncryptionServiceProvider} from "../../Crypt";
import {Database, QueryBuilder, transformFromObjectIds, transformToObjectIds} from "../../Database";
import {EventServiceProvider} from "../../Events";
import {InertiaServiceProvider} from "../../Packages/Inertia/InertiaServiceProvider";
import {RouteServiceProvider} from "../../Routing/RouteServiceProvider";
import {SecurityServiceProvider} from "../../Security/SecurityServiceProvider";
import {SessionServiceProvider} from "../../Session/SessionServiceProvider";
import {StorageServiceProvider} from "../../Storage";
import {bootApp, unloadApp} from "../preptests";

describe('model logic', () => {

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

	test('loading query builder from container', async () => {
		const builder = app().resolve<QueryBuilder<User>>('Model:QueryBuilder:User');

		expect(builder).toBeInstanceOf(QueryBuilder);
	});

	test('query builder from container doesnt affect other builders in container', async () => {
		const builderOne = app().resolve<QueryBuilder<User>>('Model:QueryBuilder:User');
		expect(builderOne).toBeInstanceOf(QueryBuilder);

		builderOne.where({orderValue : 1});
		expect(builderOne._filter.getQuery().orderValue).toEqual(1);

		const builderTwo = app().resolve<QueryBuilder<User>>('Model:QueryBuilder:User');
		builderTwo.where({orderValue : 2});

		expect(builderOne._filter.getQuery().orderValue).toEqual(1);
		expect(builderTwo._filter.getQuery().orderValue).toEqual(2);

	});

	test('using query builder from model', async () => {
		const q1 = User.query().where({orderValue : 1});
		expect(q1._filter.getQuery().orderValue).toEqual(1);

		const q2 = User.query().where({orderValue : 2});
		expect(q1._filter.getQuery().orderValue).toEqual(1);
		expect(q2._filter.getQuery().orderValue).toEqual(2);
	});

	test('using collection from query builder', async () => {
		const q1 = User.query().where({orderValue : 1});
		expect(q1._collection.collectionName).toEqual('users');

		const q2 = Book.query().where({title : '1'});
		expect(q2._collection.collectionName).toEqual('books');
	});

	test('model fields get defined', async () => {
		const user = new User();

		const fields = user.getModelFields();

		expect(fields).toContain('_id');
	});

	test('deep mapping object ids on any type', async () => {

		const regularStringObj = transformToObjectIds({
			id     : new ObjectId().toHexString(),
			ids    : [
				new ObjectId().toHexString(),
				new ObjectId().toHexString()
			],
			arrObj : [
				{id : new ObjectId().toHexString()},
				{id : new ObjectId().toHexString()}
			],
			b      : false,
			n      : null,
			i      : 23
		});

		expect(regularStringObj.id).toBeInstanceOf(ObjectId);
		expect(regularStringObj.ids[0]).toBeInstanceOf(ObjectId);
		expect(regularStringObj.arrObj[0].id).toBeInstanceOf(ObjectId);
		expect(regularStringObj.b).toBeBoolean();
		expect(regularStringObj.n).toBeNull();
		expect(regularStringObj.i).toBeNumber();

		const objectIdsObj = transformFromObjectIds({
			id     : new ObjectId(),
			ids    : [
				new ObjectId(),
				new ObjectId()
			],
			arrObj : [
				{id : new ObjectId()},
				{id : new ObjectId()}
			],
			b      : false,
			n      : null,
			i      : 23
		});

		expect(objectIdsObj.id).toBeString();
		expect(objectIdsObj.ids[0]).toBeString();
		expect(objectIdsObj.arrObj[0].id).toBeString();
		expect(objectIdsObj.b).toBeBoolean();
		expect(objectIdsObj.n).toBeNull();
		expect(objectIdsObj.i).toBeNumber();

	});

	test('deep mapping object ids when saving/retrieving model', async () => {

		const baseUserData = {
			bookId      : new ObjectId(),
			objectIdArr : [new ObjectId(), new ObjectId()],
			objectIdObj : {id : new ObjectId(), deeper : [new ObjectId()]},
			_user: {}
		};

		const user = await User.create(baseUserData);

		expect(user.bookId).toBeInstanceOf(ObjectId);
		expect(user.objectIdArr[0]).toBeInstanceOf(ObjectId);
		expect(user.objectIdArr[1]).toBeInstanceOf(ObjectId);
		expect(user.objectIdObj.id).toBeInstanceOf(ObjectId);
		expect(user.objectIdObj.deeper[0]).toBeInstanceOf(ObjectId);

		const dehydrated: any = JSON.parse(JSON.stringify(user));

		expect(dehydrated.bookId).toBeString();
		expect(dehydrated.objectIdArr[0]).toBeString();
		expect(dehydrated.objectIdArr[1]).toBeString();
		expect(dehydrated.objectIdObj.id).toBeString();
		expect(dehydrated.objectIdObj.deeper[0]).toBeString();
	});


});
