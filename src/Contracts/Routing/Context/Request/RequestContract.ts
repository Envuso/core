import {HTTPMethods} from "fastify";
import {Multipart} from "fastify-multipart";
import {UploadedFile} from "../../../../Routing/Context/Request/UploadedFile";
import {AuthenticatableContract} from "../../../Authentication/UserProvider/AuthenticatableContract";
import {SessionContract} from "../../../Session/SessionContract";
import {RequestResponseContextContract} from "../RequestResponseContextContract";
import {UploadedFileContract} from "./UploadedFileContract";

export interface RequestContract extends RequestResponseContextContract {

	/**
	 * Get the body of the request
	 */
	body<T>(): T;

	/**
	 * Get all of the query parameters from the request
	 */
	query<T>(): T;

	/**
	 * Get the ip the request originated from
	 */
	ip(): string;

	/**
	 * an array of the IP addresses, ordered from closest to furthest,
	 * in the X-Forwarded-For header of the incoming request
	 * (only when the trustProxy option is enabled)
	 *
	 * @see https://www.fastify.io/docs/latest/Request/
	 */
	ips(): string[];

	/**
	 * The full url of the incoming request
	 */
	url(): string;

	/**
	 * Returns the path of the request, for example, imagine:
	 * https://example.com/testing/route. This method will return /testing/route
	 */
	path(): string;

	/**
	 * The method of the incoming request, GET, PUT etc
	 */
	method(): HTTPMethods;

	/**
	 * The id assigned to this request
	 */
	id(): string;

	/**
	 * Get a value from the request body
	 *
	 * @param key
	 * @param _default
	 */
	get<T>(key: string, _default?: any): T;

	/**
	 * Get all body/query inputs as one object
	 *
	 * @template T
	 * @return {T}
	 */
	all<T extends object>(): T;

	/**
	 * Returns true when value is "1", "true", "on", and "yes". Otherwise, returns false.
	 *
	 * @param {string} key
	 * @param {boolean} _default
	 */
	getBoolean(key: string, _default?: any): boolean;

	/**
	 * Set file information that has been processed and is
	 * ready to upload/stream to s3 etc
	 *
	 * @param file
	 */
	setUploadedFile(file: Multipart): Promise<void>;

	/**
	 * Does the request contain any files?
	 */
	hasFiles(): boolean;

	/**
	 * Get all files on the request
	 */
	files(): UploadedFileContract[];

	/**
	 * Get all files submitted on the request, but as an object of key -> value
	 * rather than an array of uploaded files
	 *
	 * @returns {{[p: string]: UploadedFile}}
	 */
	filesKeyed(): { [key: string]: UploadedFile };

	/**
	 * Get a singular file on the request
	 *
	 * @param key
	 */
	file(key: string): UploadedFileContract | null;

	/**
	 * Get the session id from our session cookie
	 *
	 * @return {string | null}
	 */
	getSessionId(): string | null;

	/**
	 * Does our request/response contain Content-Type application/json?
	 * IE; our client is asking for JSON response
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @return {boolean}
	 */
	isJson(): boolean;

	/**
	 * Does our request/response contain Content-Type text/html?
	 * IE; our client is asking for HTML response
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @return {boolean}
	 */
	isHtml(): boolean;

	/**
	 * @credits: Laravel/Symfony Framework
	 *
	 * Returns true if the request is an XMLHttpRequest.
	 *
	 * It works if your JavaScript library sets an X-Requested-With HTTP header.
	 * It is known to work with common JavaScript frameworks:
	 *
	 * @see https://wikipedia.org/wiki/List_of_Ajax_frameworks#JavaScript
	 *
	 * @return {boolean}
	 */
	isXmlHttpRequest(): boolean;

	isAjax(): boolean;

	isPjax(): boolean;

	/**
	 * Does our request/response contain Accept application/json?
	 * IE; Is our client willing to accept json?
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @return {boolean}
	 */
	wantsJson(): boolean;

	/**
	 * Does our request/response contain Accept text/html
	 * IE; Is our client willing to accept html?
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @return {boolean}
	 */
	wantsHtml(): boolean;

	/**
	 * Retrieve an item that was flashed onto the session
	 *
	 * @param {string} key
	 * @param _default
	 */
	old<T extends any>(key?: string, _default?: any): T[];

	/**
	 * Get the currently authenticated user.
	 * Returns null if user is not authenticated.
	 *
	 * @returns {AuthenticatableContract | null}
	 */
	user<T>(): AuthenticatableContract<T> | null;

	/**
	 * Check if the specified input is an empty string
	 *
	 * @param {string} key
	 * @returns {boolean}
	 */
	isEmptyString(key: string): boolean;

	/**
	 * Check if the input has the specified key
	 *
	 * @param {string} keys
	 * @returns {boolean}
	 */
	has(...keys: string[]): boolean;

	/**
	 * The inverse of )has for readability
	 *
	 * @param {string} keys
	 * @returns {boolean}
	 */
	missing(...keys: string[]): boolean;

	/**
	 * Get the specified items from the request body/query
	 *
	 * @param {string} keys
	 * @returns {T[]}
	 */
	only<T extends any>(...keys: string[]): T[];

	/**
	 * Get all items from the request body/query, except the specified items
	 *
	 * @param {string} keys
	 * @returns {T[]}
	 */
	except<T extends any>(...keys: string[]): T[];

	/**
	 * Get the keys of all the inputs on the request, including files
	 *
	 * @returns {string[]}
	 */
	keys(): string[];

	/**
	 * Get all of the file keys defined on the request
	 *
	 * @returns {string[]}
	 */
	fileKeys(): string[];

	/**
	 * Get the referer header
	 *
	 * @returns {string | null}
	 */
	getReferer(): string | null;

	/**
	 * Determine if the request is the result of a prefetch call.
	 *
	 * @returns {boolean}
	 */
	prefetch(): boolean;

	/**
	 * Is the request using HTTPS?
	 *
	 * @returns {boolean}
	 */
	isSecure(): boolean;

	/**
	 * Get the current requests scheme
	 *
	 * @returns {"http" | "https"}
	 */
	scheme(): 'http' | 'https';

	/**
	 * Try to correctly detect JSON only requests
	 *
	 * @returns {boolean}
	 */
	expectsJson(): boolean;

	/**
	 * Access the session via the request
	 *
	 * @returns {SessionContract}
	 */
	session(): SessionContract;

	convertEmptyStringsToNull(): void;
}
