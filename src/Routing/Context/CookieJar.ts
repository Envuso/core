import {parse, serialize} from 'cookie';
import {FastifyRequest} from "fastify";
import {ConfigRepository, resolve} from "../../AppContainer";
import {Log} from "../../Common";
import {Encryption} from "../../Crypt";
import {RequestContext} from "./RequestContext";
import {Session} from "./Session";

export interface SessionConfiguration {
	cookie: CookieConfiguration;
	cookieName: string;
	encryptCookies: boolean;
}

export interface CookieConfiguration {
	path: string;
	httpOnly: boolean;
	secure: boolean;
	expires: Date;
	sameSite: boolean;
	domain: null;
}

export class CookieJar {
	private _config: SessionConfiguration;
	private _jar: Map<string, any> = new Map();
	private _secret: string;

	constructor() {
		const configRepository = resolve(ConfigRepository);

		this._config = configRepository.get<SessionConfiguration>('session');
		this._secret = configRepository.get('app.appKey');
	}

	/**
	 * Set a key/value to be added to the request as a cookie.
	 *
	 * @param key
	 * @param value
	 */
	put(key, value) {
		this._jar.set(key, value);
	}

	/**
	 * Get a cookies value from the request or one that was set in the response.
	 *
	 * @param key
	 * @param _default
	 * @returns {string | null}
	 */
	get<T>(key, _default = null): T {
		const cookie = this._jar.get(key);

		if (!cookie)
			return _default as T;

		return cookie as T;
	}

	/**
	 * Check if X cookie has been added to the request/response
	 *
	 * @param key
	 * @returns {boolean}
	 */
	public has(key) {
		return this._jar.has(key);
	}

	/**
	 * Parse the cookies from the request and store them on the cookie jar
	 *
	 * @param {FastifyRequest} request
	 * @returns {this}
	 */
	public setCookies(request: FastifyRequest) {

		const cookies = parse(request.raw.headers.cookie || '');

		for (let key of Object.keys(cookies)) {
			let value = cookies[key];
			try {
				value = Encryption.decrypt(value) as string;
			} catch (e) {
				Log.error('Failed to decrypt cookie value...');
			}

			this._jar.set(key, value);
		}

		return this;
	}

	public setCookiesOnResponse() {
		// const authentication = resolve(Authentication);
		//
		// if (!authentication.isUsingProvider(SessionAuthenticationProvider)) {
		// 	return;
		// }

		// if (RequestContext.response().hasHeader('Set-Cookie')) {
		//
		// 	const currentCookie = RequestContext.response().getHeader('Set-Cookie');
		//
		// 	if (typeof currentCookie === 'string') {
		//
		// 	}
		//
		// }

		if (RequestContext.isUsingSession()) {
			this._jar.set(Session.getCookieName(), RequestContext.session().getId());
		}

		for (let key of this._jar.keys()) {

			const originalValue = this._jar.get(key);

			const value  = this._config.encryptCookies ? Encryption.encrypt(originalValue) : originalValue;
			const cookie = serialize(key, value, this._config.cookie);

			RequestContext.response().header(
				'Set-Cookie', cookie
			);
		}
	}

}
