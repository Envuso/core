import "reflect-metadata";
import 'jest-extended';

import {Book} from "../../App/Models/Book";
import {User} from "../../App/Models/User";
import {app} from "../../AppContainer";
import {AuthenticationServiceProvider} from "../../Authentication";
import {AuthorizationServiceProvider} from "../../Authorization/AuthorizationServiceProvider";
import {EncryptionServiceProvider} from "../../Crypt";
import {Database, QueryBuilder} from "../../Database";
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
});
