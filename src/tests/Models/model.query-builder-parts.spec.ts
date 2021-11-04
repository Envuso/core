import "reflect-metadata";
import 'jest-extended';
import {ObjectId} from "mongodb";
import {User} from "../../App/Models/User";
import {AuthenticationServiceProvider} from "../../Authentication";
import {AuthorizationServiceProvider} from "../../Authorization/AuthorizationServiceProvider";
import {EncryptionServiceProvider} from "../../Crypt";
import {GeoNearAggregation, QueryAggregation} from "../../Database/Mongo/QueryAggregation";
import {QueryBuilderParts} from "../../Database/Mongo/QueryBuilderParts";
import {EventServiceProvider} from "../../Events";
import {InertiaServiceProvider} from "../../Packages/Inertia/InertiaServiceProvider";
import {RouteServiceProvider} from "../../Routing/RouteServiceProvider";
import {SecurityServiceProvider} from "../../Security/SecurityServiceProvider";
import {SessionServiceProvider} from "../../Session/SessionServiceProvider";
import {StorageServiceProvider} from "../../Storage";
import {bootApp, unloadApp} from "../preptests";


describe('model query builder object id conversions', () => {

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
		await unloadApp(false);
	});


	test('model query builder gets initiated with object ids', async () => {
		const builder = new QueryBuilderParts(User);
		expect(builder.getObjectIds().length > 1).toBeTruthy();
	});

	test('converting key/value getting converted to objectid', async () => {
		const builder = new QueryBuilderParts(User);

		builder.add('something', 'yeeeee');
		builder.add('anotherSomething', 'yeeeee number two');
		builder.add('_id', '613beda4911fb7a631c38a6a');

		const q = builder.getQuery();

		expect(q._id).toBeInstanceOf(ObjectId);
	});

	test('converting key using dot access getting converted to objectid', async () => {
		const builder = new QueryBuilderParts(User);


		builder.add('something', 'yeeeee');
		builder.add('anotherSomething', 'yeeeee number two');
		builder.add('user.someValue', true);
		builder.add('user._id', '613beda4911fb7a631c38a6a');

		const q = builder.getQuery();

		expect(q.user._id).toBeInstanceOf(ObjectId);
	});

	test('converting key with array value getting converted to objectid', async () => {
		const builder = new QueryBuilderParts(User);


		builder.add('something', 'yeeeee');
		builder.add('anotherSomething', 'yeeeee number two');
		builder.add('user._id', ['613beda4911fb7a631c38a6a', '613beda4911fb7a631c38a7a']);

		const q = builder.getQuery();

		expect(q.user._id[0]).toBeInstanceOf(ObjectId);
		expect(q.user._id[1]).toBeInstanceOf(ObjectId);
	});

	test('converting key with object value getting converted to objectid', async () => {
		const builder = new QueryBuilderParts(User);

		builder.add('user', {
			_id : '613beda4911fb7a631c38a6a'
		});

		builder.add('something', 'yeeeee');
		builder.add('anotherSomething', 'yeeeee number two');

		const q = builder.getQuery();

		expect(q.user._id).toBeInstanceOf(ObjectId);
	});

	test('using some actual mongo queries', async () => {
		const builder = new QueryBuilderParts(User);

		builder.add('$set.user', {_id : '613beda4911fb7a631c38a6a'});
		builder.add('$set.something', 'yeeeee');
		builder.add('$set.anotherSomething', 'yeeeee number two');

		const q = builder.getQuery();

		expect(q.$set.user._id).toBeInstanceOf(ObjectId);
		expect(q.$set.something).toBeString();
		expect(q.$set.anotherSomething).toBeString();
	});

	test('pushing only an object to the query', async () => {
		const builder = new QueryBuilderParts(User);

		builder.add({
			$set : {
				user : {
					_id : '613beda4911fb7a631c38a6a'
				}
			}
		});

		const q = builder.getQuery();

		expect(q.$set.user._id).toBeInstanceOf(ObjectId);
	});

	test('$geoNear + where() gets correctly positioned in pipeline', async () => {

		const geoNearData: GeoNearAggregation = {
			near : {
				type        : 'Point',
				coordinates : [0, 0]
			}
		};
		const objId                           = new ObjectId();

		const q = User.query()
			.where('_id', objId)
			.aggregationPipeline(builder => {
				return builder.addGeoNear(geoNearData);
			});

		expect(q.aggregationPipelineBuilder().aggregations[0]).toEqual({$geoNear : geoNearData});

		const res = q.resolveCursor({}, 'get');

		expect(q.aggregationPipelineBuilder().aggregations[0]).toEqual({$geoNear : geoNearData});
		expect(q.aggregationPipelineBuilder().aggregations[1]).toEqual({"$match" : {'_id' : objId}});

		const qtwo = User.query()
			.where('_id', objId)
			.where('name', objId)
			.aggregationPipeline(builder => {
				const b = new QueryBuilderParts(new User());
				b.add({'someUserId' : objId});
				return builder.setFilterQuery(b);
			});

		expect(qtwo.aggregationPipelineBuilder().aggregations[0]).toEqual({"$match" : {'someUserId' : objId}});

		const restwo = qtwo.resolveCursor({}, 'get');

		expect(qtwo.aggregationPipelineBuilder().aggregations[0]).toEqual({"$match" : {'_id' : objId, 'name' : objId.toString()}});
		expect(qtwo.aggregationPipelineBuilder().aggregations[1]).toEqual({"$match" : {'someUserId' : objId}});


	});

});
