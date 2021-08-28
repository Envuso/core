import {parse, serialize} from 'cookie';
import {FastifyRequest} from "fastify";
import {ConfigRepository, resolve} from "../../AppContainer";
import {Log} from "../../Common";
import {Encryption} from "../../Crypt";
import {RequestContext} from "./RequestContext";
import {Session} from "./Session";

export type SessionCookie = {
	name: string;
	encrypt: boolean;
}

export interface CookieConfiguration {
	path: string;
	httpOnly: boolean;
	secure: boolean;
	expires: Date;
	sameSite: boolean;
	domain: null;
}

export interface SessionConfiguration {
	cookie: CookieConfiguration;
	sessionCookie: SessionCookie;
}

export interface CookieJarValue {
	value: any | string;
	encrypted: boolean;
	isDecrypted: boolean;
}

export class CookieJar {
	private _config: SessionConfiguration;
	private _jar: Map<string, CookieJarValue> = new Map();
	private _secret: string;

	constructor() {
		const configRepository = resolve(ConfigRepository);

		this._config = configRepository.get<SessionConfiguration>('session');
		this._secret = configRepository.get('app.appKey');
	}

	/**
	 * Set a key/value to be added to the request as a cookie.
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {boolean} encrypted
	 *
	 * @returns {CookieJar}
	 */
	put(key: string, value: any, encrypted: boolean = false): CookieJar {
		this._jar.set(key, {
			value       : value,
			encrypted   : encrypted,
			isDecrypted : true,
		});

		return this;
	}

	/**
	 * Get a cookies value from the request or one that was set in the response.
	 *
	 * @param key
	 * @param _default
	 *
	 * @returns {string | null}
	 */
	get<T>(key: string, _default = null): T {
		const cookie = this._jar.get(key);

		if (!cookie)
			return _default as T;

		let value = cookie.value;

		if (cookie.encrypted && !cookie.isDecrypted) {
			try {
				value = Encryption.decrypt(value) as string;
				this._jar.set(key, {
					value       : value,
					encrypted   : true,
					isDecrypted : true,
				});
			} catch (e) {
				Log.error('Failed to decrypt cookie value...');
			}
		}

		return value as T;
	}

	/**
	 * Check if a cookie in the jar was marked as encrypted
	 *
	 * @param {string} key
	 *
	 * @return {boolean}
	 */
	isEncrypted(key: string): boolean {
		const cookie = this._jar.get(key);

		if (!cookie) {
			return false;
		}

		return cookie.encrypted;
	}

	/**
	 * Check if X cookie has been added to the request/response
	 *
	 * @param {string} key
	 *
	 * @returns {boolean}
	 */
	public has(key: string): boolean {
		return this._jar.has(key);
	}

	/**
	 * Parse the cookies from the request and store them on the cookie jar
	 *
	 * @param {FastifyRequest} request
	 * @returns {this}
	 */
	public setCookies(request: FastifyRequest): CookieJar {
		const cookies = parse(request.raw.headers.cookie || '');

		for (let key of Object.keys(cookies)) {
			let value = cookies[key];

			const cookieValue: CookieJarValue = {
				value       : value,
				encrypted   : false,
				isDecrypted : false,
			};

			// It looks like our cookie may be encrypted by us...
			// We can attempt to set cookieValue.encrypted = true
			if (value.toString().substr(0, 5) === 'cved:') {
				// We'll remove the cved: prefix and store the value
				cookieValue.value     = value.toString().substr(5);
				cookieValue.encrypted = true;
			}

			this._jar.set(key, cookieValue);
		}

		return this;
	}

	/**
	 * Before our request goes out, we want to get all
	 * cookies from the jar and set them on our response
	 */
	public setCookiesOnResponse() {
		if (RequestContext.isUsingSession()) {
			this.put(
				Session.getCookieName(),
				RequestContext.session().getId(),
				this._config.sessionCookie.encrypt
			);
		}

		for (let key of this._jar.keys()) {
			const cookieData = this._jar.get(key);

			// If a cookie uses encryption... we're going to be hacky and provide a prefix
			// This way when we read cookies from the request to set them on the cookie jar...
			// we have some kind of method to determine if they're encrypted by us.
			// And... if they are, we can decrypt them when we need them, not when we receive the request.
			const cookieValue = (cookieData.encrypted ? 'cved:' : '') +
				((cookieData.encrypted) ? Encryption.encrypt(cookieData.value) : cookieData.value);

			const cookie = serialize(key, cookieValue, this._config.cookie);

			RequestContext.response().header(
				'Set-Cookie', cookie
			);
		}
	}

}
