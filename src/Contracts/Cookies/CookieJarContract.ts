import {FastifyRequest} from "fastify";
import {Cookie} from "../../Cookies";
import {SessionConfiguration} from "../Session/Types";
import {CookieContract} from "./CookieContract";

export interface CookieJarContract {
	_config: SessionConfiguration;
	_jar: Map<string, CookieContract<any>>;
	_secret: string;

	/**
	 * Set a key/value to be added to the request as a cookie.
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {boolean} signed
	 *
	 * @returns {CookieJarContract}
	 */
	put(key: string, value: any, signed?: boolean): CookieJarContract;

	/**
	 * Get all cookies in the jar
	 *
	 * @return {Cookie<any>[]}
	 */
	all(): Cookie<any>[];

	/**
	 * Get a cookies value from the request or one that was set in the response.
	 *
	 * @param {string} key
	 *
	 * @returns {CookieContract | null}
	 */
	get<T>(key: string): CookieContract<T> | null;

	/**
	 * Check if X cookie has been added to the request/response
	 *
	 * @param {string} key
	 *
	 * @returns {boolean}
	 */
	has(key: string): boolean;

	/**
	 * Parse the cookies from the request and store them on the cookie jar
	 *
	 * @param {FastifyRequest} request
	 *
	 * @returns {CookieJarContract}
	 */
	setCookies(request: FastifyRequest): CookieJarContract;

	/**
	 * Before our request goes out, we want to get all
	 * cookies from the jar and set them on our response
	 */
	setCookiesOnResponse(): void;
}
