import "reflect-metadata";
import {User} from "../App/Models/User";
import {UserPolicy} from "../App/Policies/UserPolicy";
import {App} from "../AppContainer";
import {ModelDecoratorMeta} from "../Database";
import {Server} from "../Server/Server";
import {bootApp, unloadApp} from "./preptests";



beforeAll(() => bootApp());
afterAll(() => unloadApp());

describe('model policies', () => {

	test('model policy is defined via decorator', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const meta = Reflect.getMetadata(ModelDecoratorMeta.AUTHORIZATION_POLICY_REF, User);

		expect(meta).toEqual(UserPolicy);
	});

	test('can use policy via Authorization', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);


		const user = await User.create({});
		const jwt  = user.generateToken();

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/user/policy',
			headers : {
				'Authorization' : 'Bearer ' + jwt
			}
		});

		const json = res.json();

		expect(json.result).toBeFalsy();

		const resTwo = await server._server.inject({
			method  : 'get',
			url     : '/testing/user/policy/successful',
			headers : {
				'Authorization' : 'Bearer ' + jwt
			}
		});

		const jsonTwo = resTwo.json();

		expect(jsonTwo.result).toBeTruthy();

	});

	test('can use policy via Controller', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const user = await User.create({});
		const jwt  = user.generateToken();

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/user/policy/controller',
			headers : {
				'Authorization' : 'Bearer ' + jwt
			}
		});

		const json = res.json();

		expect(json.result).toBeFalsy();

		const resTwo = await server._server.inject({
			method  : 'get',
			url     : '/testing/user/policy/controller/successful',
			headers : {
				'Authorization' : 'Bearer ' + jwt
			}
		});

		const jsonTwo = resTwo.json();

		expect(jsonTwo.result).toBeTruthy();

	});

	test('can use policy via User', async () => {
		const app    = App.getInstance();
		const server = app.container().resolve<Server>(Server);

		const user = await User.create({});
		const jwt  = user.generateToken();

		const res = await server._server.inject({
			method  : 'get',
			url     : '/testing/user/policy/controller/user',
			headers : {
				'Authorization' : 'Bearer ' + jwt
			}
		});

		const json = res.json();

		expect(json.result).toBeFalsy();

		const resTwo = await server._server.inject({
			method  : 'get',
			url     : '/testing/user/policy/controller/user/successful',
			headers : {
				'Authorization' : 'Bearer ' + jwt
			}
		});

		const jsonTwo = resTwo.json();

		expect(jsonTwo.result).toBeTruthy();

	});


});

