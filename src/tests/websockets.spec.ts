import "reflect-metadata";
import {PublicSocketListener} from "../App/Http/Sockets/PublicSocketListener";
import {User} from "../App/Models/User";
import {app} from "../AppContainer";
import {Log} from "../Common";
import {SocketServer} from "../Sockets/SocketServer";
import {SocketClient} from "../Sockets/TestingClient/src";
import 'jest-extended';
import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

jest.setTimeout(60000);

describe('Websocket channels', () => {

	test('can connect', async () => {
		const u     = await User.create({name : 'bruce'});
		const token = u.generateToken();


		const client = new SocketClient('ws://127.0.0.1:3000/');
		await client.usingJwt(token).connect();

		client.listen('hello', (data) => {
			Log.info('KEKW');
		});

		u.sendSocketEvent('hello', 'again');


		await new Promise((resolve, reject) => {
			client.subscribe('user:' + u._id, (error, channel) => {
				if (error) {
					console.error(error);
					reject(error);
					return;
				}

				u.sendSocketEvent('hello', 'again');

				setTimeout(() => resolve(true), 10000);
			});
		});


	});

	test('can connect without token', async () => {


		const u = await User.create({name : 'bruce'});

		const client = new SocketClient('ws://127.0.0.1:3000/');
		await client.usingJwt(null).connect();

		client.listen('hello', (data) => {
			Log.info('KEKW');
		});

		u.sendSocketEvent('hello', 'again');

		await new Promise((resolve, reject) => {

			client.subscribe(`user:${u._id.toString()}`, (error, channel) => {
				if (error) {
					console.error(error);
					reject(error);
					return;
				}
			});

			client.subscribe('public', (error, channel) => {
				if (error) {
					console.error(error);
					reject(error);
					return;
				}

				channel.listen('hello', data => console.log(data));

				app().resolve<SocketServer>(SocketServer).broadcast(
					PublicSocketListener,
					'public',
					"hello",
					{message : 'hi!'}
				);

				setTimeout(() => resolve(true), 10000);
			});
		});


	});


});

