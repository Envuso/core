import {FastifyRequest} from "fastify";
import {ConfigRepository, resolve} from "../AppContainer";
import {CookieJarContract} from "../Contracts/Cookies/CookieJarContract";
import {SessionConfiguration} from "../Contracts/Session/Types";
import {Cookie} from "./Cookie";


export class CookieJar implements CookieJarContract {

	public _config: SessionConfiguration;

	public _jar: Map<string, Cookie<any>> = new Map();

	public _secret: string;

	constructor() {
		const configRepository = resolve(ConfigRepository);

		this._config = configRepository.get<string, any>('Session');
		this._secret = configRepository.get<string, any>('App.appKey');
	}

	/**
	 * Set a key/value to be added to the request as a cookie.
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {boolean} signed
	 *
	 * @returns {CookieJar}
	 */
	public put(key: string, value: any, signed: boolean = false): CookieJarContract {
		if (value instanceof Cookie) {
			this._jar.set(key, value);

			return this;
		}

		const cookie = Cookie.create(key, value, signed);

		this._jar.set(
			key, cookie
		);

		return this;
	}

	/**
	 * Get all cookies in the jar
	 *
	 * @return {Cookie<any>[]}
	 */
	public all(): Cookie<any>[] {
		return [...this._jar.values()];
	}

	/**
	 * Get a cookies value from the request or one that was set in the response.
	 *
	 * @param {string} key
	 *
	 * @returns {Cookie | null}
	 */
	public get<T>(key: string): Cookie<T> | null {
		const cookie = this._jar.get(key);

		if (!cookie) {
			return null;
		}

		return cookie as Cookie<T>;
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
//		const cookies = Cookie.fromHeader(request.raw.headers.cookie || '');
//
//		for (let cookie of cookies) {
//			this._jar.set(cookie.getName(), cookie);
//		}

		return this;
	}

	/**
	 * Before our request goes out, we want to get all
	 * cookies from the jar and set them on our response
	 */
	public setCookiesOnResponse() {
//		if (RequestContext.isUsingSession()) {
//			this.put(
//				config<string>('session.sessionCookie.name', 'id'),
//				RequestContext.session().getId(),
//				this._config.cookie.signed
//			);
//		}
//
//		for (let cookie of this._jar.values()) {
//			RequestContext.response().setHeader(
//				'Set-Cookie', cookie.toHeaderString()
//			);
//		}
	}

}
