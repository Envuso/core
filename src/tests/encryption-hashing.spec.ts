import "reflect-metadata";
import {resolve} from "../AppContainer/helpers";
import {Encryption} from "../Crypt/Encryption";
import {bootApp, unloadApp} from "./preptests";

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


	test('round-trips any JSON value', async () => {
		const enc = resolve(Encryption);

		for (const value of ['', 'hello', 0, 42, true, null, {a : [1, {b : 'c'}]}]) {
			expect(enc.decrypt(enc.encrypt(value))).toEqual(value);
		}
	});

	test('the same value encrypts differently each time (random IV)', async () => {
		const enc = resolve(Encryption);

		expect(enc.encrypt('same')).not.toBe(enc.encrypt('same'));
	});

	test('tampering is detected', async () => {
		const enc       = resolve(Encryption);
		const encrypted = enc.encrypt('hello world');
		const payload   = Buffer.from(encrypted.slice(3), 'base64url');

		payload[payload.length - 1] ^= 1;

		expect(() => enc.decrypt('v1.' + payload.toString('base64url'))).toThrow();
		expect(enc.tryDecrypt('v1.' + payload.toString('base64url'))).toBeNull();
		expect(enc.tryDecrypt('not encrypted')).toBeNull();
	});

	test('a value only decrypts with the context it was encrypted for', async () => {
		const enc       = resolve(Encryption);
		const encrypted = enc.encrypt('session-id', 'cookie:session');

		expect(enc.decrypt(encrypted, 'cookie:session')).toBe('session-id');
		expect(enc.tryDecrypt(encrypted, 'cookie:other')).toBeNull();
		expect(enc.tryDecrypt(encrypted)).toBeNull();
	});

	test('another key cannot decrypt', async () => {
		const enc   = resolve(Encryption);
		const other = enc.newInstance('another-app-key-that-is-long-enough-123');

		expect(other.tryDecrypt(enc.encrypt('secret'))).toBeNull();
		// newInstance() didn't replace the app's instance
		expect(Encryption.decrypt(enc.encrypt('still works'))).toBe('still works');
	});

});

