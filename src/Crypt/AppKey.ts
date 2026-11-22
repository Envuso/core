import {resolve} from "../AppContainer/helpers";
import {ConfigRepository} from "../AppContainer/Config/ConfigRepository";

export const MIN_APP_KEY_LENGTH = 32;

export class AppKeyException extends Error {
	constructor(reason: string) {
		super(
			`${reason}\n` +
			`APP_KEY signs JWTs and encrypts cookies and sessions, so it must be a long random secret.\n` +
			`Generate one and put it in your .env:\n` +
			`  bun -e "console.log('APP_KEY=' + require('crypto').randomBytes(32).toString('base64url'))"`
		);
		this.name = 'AppKeyException';
	}
}

/**
 * Throw unless `key` is usable as the app key.
 */
export function assertStrongAppKey(key: unknown): asserts key is string {
	if (typeof key !== 'string' || key.trim() === '') {
		throw new AppKeyException('No app key is configured (APP_KEY / AppConfiguration.appKey).');
	}

	if (key.length < MIN_APP_KEY_LENGTH) {
		throw new AppKeyException(`The app key is too short (${key.length} characters, at least ${MIN_APP_KEY_LENGTH} required).`);
	}
}

/**
 * The configured app key; throws if it is missing or weak.
 */
export function appKey(): string {
	const key = resolve(ConfigRepository).get<string, any>('App.appKey');

	assertStrongAppKey(key);

	return key;
}
