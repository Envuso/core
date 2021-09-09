import "reflect-metadata";
import {User} from "../App/Models/User";
import {Log} from "../Common";
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
			Log.info('KEKW')
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


});

