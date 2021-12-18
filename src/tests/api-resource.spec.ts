import "reflect-metadata";
import 'jest-extended';
import {User} from "../App/Models/User";
import {AuthenticationServiceProvider} from "../Authentication";
import {AuthorizationServiceProvider} from "../Authorization/AuthorizationServiceProvider";
import {RequestContextContract} from "../Contracts/Routing/Context/RequestContextContract";
import {EncryptionServiceProvider} from "../Crypt";
import {EventServiceProvider} from "../Events";
import {InertiaServiceProvider} from "../Packages/Inertia/InertiaServiceProvider";
import {ApiResource} from "../Routing";
import {RouteServiceProvider} from "../Routing/RouteServiceProvider";
import {SecurityServiceProvider} from "../Security/SecurityServiceProvider";
import {SessionServiceProvider} from "../Session/SessionServiceProvider";
import {StorageServiceProvider} from "../Storage";

import {bootApp, unloadApp} from "./preptests";

describe('api resources', () => {

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

	test('basic transformation of resource', async () => {

		const user = await User.create({
			name : 'Brian'
		});

		class UserResource extends ApiResource<User> {
			public transform(request: RequestContextContract): any {
				return {
					_id  : this.data._id,
					name : this.data.name,
				};
			}
		}

		const resource    = UserResource.from(user);
		const transformed = resource.toResponse();

		expect(transformed._id).toBeString();
		expect(transformed.name).toBeString();
	});

	test('array of models', async () => {

		const user = await User.createMany([
			{name : 'Brian'},
			{name : 'BrianTwo'},
			{name : 'BrianThree'},
		]);

		const users = await User.query()
			.whereIn('_id', user.ids)
			.get();

		class UserResource extends ApiResource<User> {
			public transform(request: RequestContextContract): any {
				return {
					_id  : this.data._id,
					name : this.data.name,
				};
			}
		}

		const resource    = UserResource.collection(users);
		const transformed = resource.toResponse();

		expect(transformed[0]._id).toBeString();
		expect(transformed[0].name).toBeString();
	});

	test('paginated models', async () => {

		const user = await User.createMany([
			{name : 'Brian'},
			{name : 'BrianTwo'},
			{name : 'BrianThree'},
		]);

		const users = await User.query()
			.paginate(10);

		class UserResource extends ApiResource<User> {
			public transform(request: RequestContextContract): any {
				return {
					_id  : this.data._id,
					name : this.data.name,
				};
			}
		}

		const resource    = UserResource.collection(users);
		const transformed = resource.toResponse();

		expect(transformed.data[0]._id).toBeString();
		expect(transformed.data[0].name).toBeString();
		expect(transformed.pagination.hasNext).toBeDefined();
	});

	test('resource with nested resource and whenLoaded', async () => {

		const user = await User.create({
			name : 'Brian'
		});

		const userTwo = await User.create({
			name : 'BrianTwo'
		});

		user.someUser = userTwo;

		class UserResource extends ApiResource<User> {
			public transform(request: RequestContextContract): any {
				return {
					_id                 : this.data._id,
					name                : this.data.name,
					potentiallyNullable : this.data.someUser,
					someUser            : this.whenLoaded('someUser', UserResource),
					someUserTwo         : this.when(!!this.data.someUser, UserResource.from(this.data.someUser)),
				};
			}
		}

		const resource    = UserResource.from(user);
		const transformed = resource.toResponse();

		expect(transformed._id).toBeString();
		expect(transformed.name).toBeString();
		expect(transformed.someUser).toBeObject();
		expect(transformed.someUser._id).toBeString();
		expect(transformed.someUser.name).toBeString();
	});

});
