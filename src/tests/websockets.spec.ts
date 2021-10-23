import "reflect-metadata";
import {User} from "../App/Models/User";
import {resolve} from "../AppContainer";
import {EncryptionServiceProvider} from "../Crypt";
import {EventServiceProvider} from "../Events";
import {InertiaServiceProvider} from "../Packages/Inertia/InertiaServiceProvider";
import {RedisServiceProvider} from "../Redis/RedisServiceProvider";
import {AuthenticatedMiddleware} from "../Routing/Middleware/Middlewares/AuthenticatedMiddleware";
import {RouteServiceProvider} from "../Routing/RouteServiceProvider";
import {SecurityServiceProvider} from "../Security/SecurityServiceProvider";
import {SessionServiceProvider} from "../Session/SessionServiceProvider";
import {ConnectionStatus, SocketClient} from "../WebSockets/TestingClient/src";
import 'jest-extended';
import {StorageServiceProvider} from "../Storage";
import {WebSocketServer} from "../WebSockets/WebSocketServer";
import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

jest.setTimeout(10000);

const createSocketClient = async (jwt: string = null, host: string = 'ws://127.0.0.1:3335') => {
	const client = new SocketClient(host);
	if (jwt) {
		client.usingJwt(jwt);
	}

	await client.connect();

	return client;
};

const createUserAndToken = async () => {
	const u     = await User.create({name : 'bruce'});
	const token = u.generateToken();

	return {user : u, token};
};


describe('websocket connections', () => {
	test('connecting without a jwt', async () => {
		const {user, token} = await createUserAndToken();
		const client        = await createSocketClient();

		expect(client.getConnectionStatus()).toEqual(ConnectionStatus.CONNECTED);

		client.terminate();
	});

	test('connecting without jwt and with authenticated global middleware', async () => {
		const {user, token} = await createUserAndToken();

		resolve(WebSocketServer).addGlobalMiddleware(AuthenticatedMiddleware);

		const client = await createSocketClient();

		expect(client.getConnectionStatus()).toEqual(ConnectionStatus.DISCONNECTED);

		client.terminate();
	});

	test('connecting with jwt and with authenticated global middleware', async () => {
		const {user, token} = await createUserAndToken();

		resolve(WebSocketServer).addGlobalMiddleware(AuthenticatedMiddleware);

		const client = await createSocketClient(token);

		expect(client.getConnectionStatus()).toEqual(ConnectionStatus.CONNECTED);

		client.terminate();
	});


	test('connecting with a jwt', async () => {
		const {user, token} = await createUserAndToken();
		const client        = await createSocketClient(token);

		expect(client.getConnectionStatus()).toEqual(ConnectionStatus.CONNECTED);

		client.terminate();
	});

});

describe('websocket channels', () => {

	test('Connecting to a wildcard channel without access', async () => {
		const {user, token} = await createUserAndToken();
		const client        = await createSocketClient(token);


		await (new Promise((resolve, reject) => {
			client.subscribe(`user:1234`, (error, channel) => {
				if (error) {
					resolve({channel, error});
					expect(error.message).toEqual('Failed to connect to channel, likely due to not being authorised to access this channel.');
				}

				resolve({channel, error});
			});
		}));


		client.terminate();
	});

	test('Connecting to a wildcard channel with access', async () => {
		const {user, token} = await createUserAndToken();
		const client        = await createSocketClient(token);


		await (new Promise((resolve, reject) => {
			client.subscribe(`user:${user._id.toString()}`, (error, channel) => {

				if (error) {
					resolve({channel, error});
				}

				expect(error).toBeNull();
				expect(channel.getName()).toEqual(`user:${user._id.toString()}`);

				resolve({channel, error});
			});
		}));


		client.terminate();
	});

	test('Subscribing to a public channel', async () => {
		const {user, token} = await createUserAndToken();
		const client        = await createSocketClient(token);


		await (new Promise((resolve, reject) => {
			client.subscribe(`public`, (error, channel) => {

				if (error) {
					resolve({channel, error});
				}

				expect(error).toBeNull();
				expect(channel.getName()).toEqual(`user:${user._id.toString()}`);

				resolve({channel, error});
			});
		}));


		client.terminate();
	});

	test('Unsubscribing from a public channel', async () => {
		const {user, token} = await createUserAndToken();
		const client        = await createSocketClient(token);


		await (new Promise((resolve, reject) => {
			client.subscribe(`public`, (error, channel) => {

				if (error) {
					resolve({channel, error});
				}

				expect(error).toBeNull();
				expect(channel.getName()).toEqual(`public`);

				channel.unsubscribe();

				expect(client.hasSubscription('public')).toBeFalse();

				resolve({channel, error});
			});
		}));


		client.terminate();
	});

	test('subscribing to a channel with authenticated middleware and no jwt', async () => {
		const {user, token} = await createUserAndToken();
		const client        = await createSocketClient();

		await (new Promise((resolve, reject) => {
			client.subscribe(`user:${user._id.toString()}`, (error, channel) => {

				if (error) {
					expect(error.message).toEqual('Failed to connect to channel, likely due to not being authorised to access this channel.');

					resolve({channel, error});
				}

				resolve({channel, error});
			});
		}));

		client.terminate();
	});

	test('subscribing to a channel with authenticated middleware, with jwt', async () => {
		const {user, token} = await createUserAndToken();

		const client = await createSocketClient(token);


		await (new Promise((resolve, reject) => {
			client.subscribe(`user:${user._id.toString()}`, (error, channel) => {

				if (error) {
					resolve({channel, error});
				}

				expect(error).toBeNull();

				resolve({channel, error});
			});
		}));

		client.terminate();
	});

});

