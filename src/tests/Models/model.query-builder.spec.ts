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


describe('model query builder implementation', () => {

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

	test('first()/get() query with custom options', async () => {
		const u = await User.create({name : 'sam'});

		const result = await User.query().where('_id', u._id).first({sort : {_id : 1}});
		expect(result._id).toEqual(u._id);

		const results = await User.query().where('_id', u._id).get({sort : {_id : 1}});
		expect(results[0]._id).toEqual(u._id);
	});

	test('using builder parts with .where()', async () => {
		await User.create({name : 'sam'});

		const query = User.query().where('name', 'sam');

		const q = query._filter.getQuery();

		expect(q.name).toEqual('sam');

		const result = await User.query().where('name', 'sam').first();
		expect(result.name).toEqual('sam');

		const results = await User.query().where('name', 'sam').get();
		expect(results[0].name).toEqual('sam');
	});

	test('using query builder method: whereIn', async () => {
		const u = await User.createMany([
			{name : 'whereInOne'},
			{name : 'whereInTwo'},
		]);

		const q = await User.query()
			.whereIn('name', [
				'whereInOne', 'whereInTwo',
			])
			.get();

		expect(q[0].name).toEqual('whereInOne');
		expect(q[1].name).toEqual('whereInTwo');
		expect(q.length).toEqual(2);
	});

	test('using query builder method: whereAllIn', async () => {
		const u = await User.createMany([
			{name : 'whereInOne', nameTags : ['someTag', 'someOtherTag']},
			{name : 'whereInTwo', nameTags : ['someTag', 'someOtherTag']},
		]);

		const q = await User.query()
			.whereAllIn('nameTags', ['someTag', 'someOtherTag',])
			.get();

		expect(q[0].nameTags.some(t => t === 'someTag')).toBeTruthy();
		expect(q[1].nameTags.some(t => t === 'someTag')).toBeTruthy();
		expect(q.length).toEqual(2);
	});

	/**
	 * Should return all users that have the key 'name' in their document
	 */
	test('using query builder method: exists', async () => {
		const u = await User.create({name : 'exists'});

		const q = await User.query()
			.exists('name')
			.get();

		expect(q.length >= 1).toBeTruthy();
	});

	/**
	 * should return all users that dont key 'name' in their document
	 */
	test('using query builder method: doesntExist', async () => {
		const u = await User.create({name : undefined});

		const q = await User.query()
			//@ts-ignore
			.doesntExist('someNonExistentKey')
			.get();

		expect(q.length >= 1).toBeTruthy();
	});

	test('using query builder method: limit', async () => {
		const u = await User.createMany([
			{name : 'limit'},
			{name : 'limit'},
		]);

		const q = await User.query()
			.where('name', 'limit')
			.limit(1)
			.get();

		expect(q.length).toEqual(1);
	});

	test('using query builder method: orderByDesc', async () => {
		const u = await User.createMany([
			{orderValue : 1},
			{orderValue : 2},
			{orderValue : 3},
		]);

		const q = await User.query()
			.exists('orderValue')
			.orderByDesc('orderValue')
			.first();

		expect(q.orderValue).toEqual(3);
	});

	test('using query builder method: orderByAsc', async () => {
		const u = await User.createMany([
			{orderValue : 1},
			{orderValue : 2},
			{orderValue : 3},
		]);

		const q = await User.query()
			.exists('orderValue')
			.where({
				orderValue : {
					$gte : 0
				}
			})
			.orderByAsc('orderValue')
			.first();

		expect(q.orderValue).toEqual(1);
	});

	test('using query builder method: selectFields', async () => {
		const u = await User.create({name : 'selectFields', orderValue : 1});

		const q = await User.query()
			.selectFields('name')
			.get();

		expect(q.map(w => w.orderValue).filter(w => w !== undefined).length).toEqual(0);
	});

	test('using query builder method: excludeFields', async () => {
		const u = await User.create({name : 'excludeFields', orderValue : 1});

		const q = await User.query()
			.excludeFields('orderValue')
			.get();

		expect(q.map(w => w.orderValue).filter(w => w !== undefined).length).toEqual(0);
	});

	test('using query builder method: update', async () => {
		const u = await User.create({name : 'update'});

		await User.query()
			.where('_id', u._id)
			.update({name : 'Updated update name'});

		await u.refresh();

		expect(u.name).toEqual('Updated update name');

		await u.update({name : 'Updated update name two'});

		expect(u.name).toEqual('Updated update name two');
	});

	test('using query builder method: delete', async () => {
		const u = await User.create({name : 'delete'});

		const q = await User.query()
			.where({_id : u._id})
			.delete();

		const check = await User.query()
			.where({_id : u._id})
			.first();

		expect(q).toEqual(true);
		expect(check).toEqual(null);
	});

	test('using query builder method: count', async () => {
		const u = await User.create({name : 'count'});

		const q = await User.query()
			.where('name', 'count')
			.count();

		expect(q).toEqual(1);
	});

	test('using bulkUpdate query', async () => {

		const {ids, success} = await User.createMany([
			{name : 'Something 1234'},
			{name : 'Something 1235'},
			{name : 'Something 1236'},
			{name : 'Something 1237'},
		]);

		expect(success).toBeTruthy();

		const res = await User.query().batchUpdate('_id', ids.map(id => ({
			_id  : id,
			name : 'user:' + id.toHexString()
		})));

		expect(res.ok).toBeTruthy();
	});

	test('save user after loading relation', async () => {
		const user = await User.create({name : 'sam'});

		await Book.create({userId : user._id});

		await user.load('books');

		await user.update({orderValue : 1});

		debugger;
	});

});
