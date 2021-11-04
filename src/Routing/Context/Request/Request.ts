import {FastifyRequest, HTTPMethods} from "fastify";
import {Multipart} from "fastify-multipart";
import {IncomingMessage} from "http";
import {HttpRequest} from "uWebSockets.js";
import {config} from "../../../AppContainer";
import {Obj, Str} from "../../../Common";
import {AuthenticatableContract} from "../../../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {RequestContract} from "../../../Contracts/Routing/Context/Request/RequestContract";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {SessionContract} from "../../../Contracts/Session/SessionContract";
import {Storage} from "../../../Storage";
import {RequestResponseContext} from "../RequestResponseContext";
import {UploadedFile} from "./UploadedFile";

export class Request extends RequestResponseContext implements RequestContract {

	/**
	 * If this request contains files that have been uploaded
	 *
	 * Then we will store some information about them here.
	 * At this stage, they have been semi-processed and are
	 * ready to be accessed without async code
	 *
	 * @private
	 */
	private _uploadedFiles: UploadedFile[] = [];

	constructor(context: RequestContextContract, request: FastifyRequest) {
		super(context, request);
	}

	/**
	 * Get the referer header
	 *
	 * @returns {string | null}
	 */
	public getReferer(): string | null {
		return this._headers.get('referer', null) as (string | null);
	}

	/**
	 * Check if the specified input is an empty string
	 *
	 * @param {string} key
	 * @returns {boolean}
	 */
	public isEmptyString(key: string): boolean {
		const input = this.all();

		return Str.isEmpty(input[key] ?? null);
	}

	/**
	 * Check if the input has the specified key
	 *
	 * @param {string} keys
	 * @returns {boolean}
	 */
	public has(...keys: string[]): boolean {
		const input = this.all();

		for (let key in input) {
			if (input[key] === undefined) {
				return false;
			}
		}

		return true;
	}

	/**
	 * The inverse of )has for readability
	 *
	 * @param {string} keys
	 * @returns {boolean}
	 */
	public missing(...keys: string[]): boolean {
		return !this.has(...keys);
	}

	/**
	 * Get the specified items from the request body/query
	 *
	 * @param {string} keys
	 * @returns {T[]}
	 */
	public only<T extends any>(...keys: string[]): T[] {
		return Obj.only(this.all(), keys);
	}

	/**
	 * Get all items from the request body/query, except the specified items
	 *
	 * @param {string} keys
	 * @returns {T[]}
	 */
	public except<T extends any>(...keys: string[]): T[] {
		return Obj.except(this.all(), keys);
	}

	/**
	 * Get the keys of all the inputs on the request, including files
	 *
	 * @returns {string[]}
	 */
	public keys(): string[] {
		return [
			...Object.keys(this.all()),
			...this.fileKeys(),
		];
	}

	/**
	 * Get the body of the request
	 */
	body<T>(): T {
		if (!this.isFastifyRequest(this._request)) {
			return null;
		}

		return <T>this._request.body;
	}

	/**
	 * Get the ip the request originated from
	 */
	ip(): string {
		if (!this.isFastifyRequest(this._request))
			return null;

		return this._request.ip;
	}

	/**
	 * an array of the IP addresses, ordered from closest to furthest,
	 * in the X-Forwarded-For header of the incoming request
	 * (only when the trustProxy option is enabled)
	 *
	 * @see https://www.fastify.io/docs/latest/Request/
	 */
	ips(): string[] {
		if (!this.isFastifyRequest(this._request))
			return null;

		return this._request.ips;
	}

	/**
	 * The full url of the incoming request
	 */
	url(): string {
		return this._request.url;
	}

	/**
	 * Is the request using HTTPS?
	 *
	 * @returns {boolean}
	 */
	public isSecure(): boolean {
		return this.scheme() === 'https';
	}

	/**
	 * Get the current requests scheme
	 *
	 * @returns {"http" | "https"}
	 */
	public scheme(): 'http' | 'https' {
		return (this._request as FastifyRequest).protocol.toLowerCase() as 'http' | 'https';
	}

	/**
	 * Returns the path of the request, for example, imagine:
	 * https://example.com/testing/route. This method will return /testing/route
	 */
	path(): string {
		return !(this._request instanceof IncomingMessage) ? this._request.routerPath : null;
	}

	/**
	 * The method of the incoming request, GET, PUT etc
	 */
	method(): HTTPMethods {
		return <HTTPMethods>this._request.method ?? 'GET';
	}

	/**
	 * The id assigned to this request
	 */
	id(): string {
		if (!this.isFastifyRequest(this._request)) {
			return null;
		}

		return this._request.id;
	}

	/**
	 * Get a value from the request body
	 *
	 * @param key
	 * @param _default
	 */
	get<T>(key: string, _default: any = null): T {
		if (!this.isFastifyRequest(this._request))
			return null;

		if (this._request.body && this._request.body[key]) {
			return this._request.body[key] as T;
		}

		if (this._request.query && this._request.query[key]) {
			return this._request.query[key] as T;
		}

		return _default as T;
	}

	/**
	 * Get all body/query inputs as one object
	 *
	 * @return {T}
	 */
	all<T extends object>(): T {
		if (!this.isFastifyRequest(this._request)) {
			return null;
		}

		return {
			...(this._request.body as object || {}),
			...(this._request.query as object || {}),
		} as T;
	}

	/**
	 * Returns true when value is "1", "true", "on", and "yes". Otherwise, returns false.
	 *
	 * @param {string} key
	 * @param {boolean} _default
	 */
	getBoolean(key: string, _default: any = false): boolean {
		const value = this.get(key, null);

		if (value === null) {
			return _default;
		}

		const result = Obj.toBoolean(value);

		if (result === null) {
			return _default;
		}

		return result;
	}

	/**
	 * Set file information that has been processed and is
	 * ready to upload/stream to s3 etc
	 *
	 * @param file
	 */
	async setUploadedFile(file: Multipart) {
		const tempFileName = await Storage.saveTemporaryFile(
			file.filename, file.file
		);

		const fileInstance = new UploadedFile(file, tempFileName);
		await fileInstance.setAdditionalInformation();

		/**
		 * We need to assign multipart request field data
		 * to our fastify request object.
		 *
		 * Otherwise, we could do request().get('field') and it won't exist.
		 */
		for (let key in file.fields) {
			if (key === file.filename) {
				continue;
			}

			this._request.body[key] = file.fields[key];
		}

		this._uploadedFiles.push(fileInstance);
	}

	/**
	 * Does the request contain any files?
	 */
	hasFiles(): boolean {
		return !!this._uploadedFiles.length;
	}

	/**
	 * Get all files on the request
	 */
	files(): UploadedFile[] {
		return this._uploadedFiles;
	}

	/**
	 * Get all of the file keys defined on the request
	 *
	 * @returns {string[]}
	 */
	public fileKeys(): string[] {
		return this._uploadedFiles.map(f => f.getFieldName()) ?? [];
	}

	/**
	 * Get a singular file on the request
	 *
	 * @param key
	 */
	file(key: string): UploadedFile | null {
		if (!this.hasFiles())
			return null;

		return this._uploadedFiles.find(
			f => f.getFieldName() === key
		) ?? null;
	}

	/**
	 * Get the session id from our session cookie
	 *
	 * @return {string | null}
	 */
	getSessionId(): string | null {
		const cookie = this.cookieJar().get<string>(
			config().get<string, any>('Session.sessionCookie.name', 'id')
		);

		if (!cookie) {
			return null;
		}

		return cookie.getValue();
	}

	/**
	 * Access the session via the request
	 *
	 * @returns {SessionContract}
	 */
	public session(): SessionContract {
		return this._context.session;
	}

	/**
	 * Does our request/response contain Content-Type application/json?
	 * IE; our client is asking for JSON response
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @return {boolean}
	 */
	public isJson(): boolean {
		if (!this._headers.has('Content-Type')) {
			return false;
		}
		return (this._headers.get('Content-Type') as string).contains(['/json', '+json']);
	}

	/**
	 * Does our request/response contain Content-Type text/html?
	 * IE; our client is asking for HTML response
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @return {boolean}
	 */
	public isHtml(): boolean {
		return (this._headers.get('Content-Type') as string).contains(['/html', '+html']);
	}

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
	public isXmlHttpRequest(): boolean {
		return this._headers.has('X-Requested-With', 'XMLHttpRequest');
	}

	public isAjax(): boolean {
		return this.isXmlHttpRequest();
	}

	public isPjax(): boolean {
		return this._headers.has('X-PJAX');
	}

	/**
	 * Try to correctly detect JSON only requests
	 *
	 * @returns {boolean}
	 */
	public expectsJson() {
		return (this.isAjax() && !this.isPjax()) || this.wantsJson();
	}

	/**
	 * Determine if the request is the result of a prefetch call
	 *
	 * @returns {boolean}
	 */
	public prefetch(): boolean {
		return (this._headers.get('HTTP_X_MOZ', '') as string).strcasecmp('prefect') === 0 ||
			(this._headers.get('Purpose', '') as string).strcasecmp('prefect') === 0;
	}

	/**
	 * Does our request/response contain Accept application/json?
	 * IE; Is our client willing to accept json?
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @return {boolean}
	 */
	public wantsJson(): boolean {
		return this._headers.has('Accept', 'application/json');
	}

	/**
	 * Does our request/response contain Accept text/html
	 * IE; Is our client willing to accept html?
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @return {boolean}
	 */
	public wantsHtml(): boolean {
		return this._headers.has('Accept', 'text/html');
	}

	/**
	 * Retrieve an item that was flashed onto the session
	 *
	 * @param {string} key
	 * @param _default
	 */
	public old<T extends any>(key?: string, _default?: any): T[] {
		if (!this._context.hasSession()) {
			return _default;
		}

		return this._context.session.store().getOldInput<T>(
			key, _default
		);
	}

	/**
	 * Get the currently authenticated user.
	 * Returns null if user is not authenticated.
	 *
	 * @returns {AuthenticatableContract | null}
	 */
	user<T>(): AuthenticatableContract<T> | null {
		return this._context.user ?? null;
	}

}
