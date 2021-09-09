import "reflect-metadata";
import {Rabbit} from "crypto-js";
import {User} from "../App/Models/User";
import {resolve} from "../AppContainer";
import {Encryption} from "../Crypt";
import {RabbitEncryption} from "../Crypt/RabbitEncryption";
import {bootApp, unloadApp} from "./preptests";
import 'jest-extended';

beforeAll(() => bootApp());
afterAll(() => unloadApp());


describe('Encryption methods', () => {


	test('encryption service initialization ', async () => {
		const enc = resolve(Encryption);

		expect(enc.key).toBeDefined();
	});

	test('encrypting/decrypting string', async () => {
		const enc = resolve(Encryption);

		const encrypted = enc.encrypt('hello world');
		const decrypted = enc.decrypt(encrypted);

		expect(decrypted).toEqual('hello world');
	});


	test('rabbit encryption service initialization ', async () => {
		const enc = resolve(RabbitEncryption);

		expect(enc.key).toBeDefined();
	});

	test('rabbit encryption - encrypting/decrypting string', async () => {
		const enc = resolve(RabbitEncryption);

		const encrypted = enc.encrypt('hello world');
		const decrypted = enc.decrypt(encrypted);

		expect(decrypted).toEqual('hello world');
	});

	test('encryption operations per sec', async () => {
		const rabbitEncryption = resolve(RabbitEncryption);
		const regularEncryption = resolve(Encryption);

		// Rabbit = 5000 operations in 1046 ms
		// SimpleCryptoJs = 5000 operations in 39126 ms
		// KEKW

		console.time("Rabbit");
		for (let i = 0; i < 5000; i++) {
			const encrypted = rabbitEncryption.encrypt('hello world');
			const decrypted = rabbitEncryption.decrypt(encrypted);
		}
		console.timeEnd("Rabbit");


		console.time("SimpleCrypto");
		for (let i = 0; i < 5000; i++) {
			const encrypted = regularEncryption.encrypt('hello world');
			const decrypted = regularEncryption.decrypt(encrypted);
		}
		console.timeEnd("SimpleCrypto");
	});


});

