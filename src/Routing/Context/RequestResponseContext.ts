import {FastifyReply, FastifyRequest} from "fastify";
import Reply from "fastify/lib/reply.js";
import Request from "fastify/lib/request.js";
import {IncomingHttpHeaders, IncomingMessage} from "http";
import {ObjectContainer, ObjectContainerObject} from "../../Common";
import {CookieJarContract} from "../../Contracts/Cookies/CookieJarContract";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {RequestResponseContextContract} from "../../Contracts/Routing/Context/RequestResponseContextContract";
import {RedirectResponseContract} from "../../Contracts/Routing/Context/Response/RedirectResponseContract";
import {CookieJar} from "../../Cookies";
import {RedirectResponse} from "./Response/RedirectResponse";

/**
 * This class is shared by Request/Response classes
 *
 * It allows for some single source of logic, otherwise some
 * logic would be written twice between both classes.
 */
export class RequestResponseContext implements RequestResponseContextContract {

	/**
	 * Hold the original fastify reply so we can access/use it when needed
	 */
	public _response: FastifyReply = null;

	/**
	 * Hold the original fastify request so we can access/use it when needed
	 */
	public _request: FastifyRequest | IncomingMessage = null;

	/**
	 * Handles all cookies that will be sent on the request
	 *
	 * @type {CookieJarContract}
	 * @private
	 */
	public _cookieJar: CookieJarContract;

	/**
	 * Store all headers that are available on the request/response
	 *
	 * @type {ObjectContainer<{[p: string]: number | string | string[] | undefined}>}
	 * @private
	 */
	public _headers: ObjectContainer<number | string | string[] | undefined>;

	protected _context: RequestContextContract = null;

	constructor(context: RequestContextContract, method: FastifyReply | FastifyRequest | IncomingMessage) {
		this.bindMethod(method);
		this._context   = context;
		this._cookieJar = new CookieJar();
		this._headers   = this.getHeaderContainerForMethod(method);
	}

	/**
	 * Override the cookie jar.
	 * We initialise the jar from outside of the response in the context.
	 *
	 * We then set the jar on the request and response.
	 *
	 * @param {CookieJarContract} jar
	 * @return {this}
	 */
	public setCookieJar(jar: CookieJarContract): this {
		this._cookieJar = jar;

		return this;
	}

	/**
	 * Get the response cookie handler
	 *
	 * @return {CookieJar}
	 */
	public cookieJar(): CookieJarContract {
		return this._cookieJar;
	}

	/**
	 * Get all headers defined on the request/response
	 *
	 * @return {ObjectContainerObject<number | string | string[] | undefined>}
	 */
	public headers(): ObjectContainerObject<number | string | string[] | undefined> {
		return this._headers.all();
	}

	/**
	 * Do we have x header set on the request/response?
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @param {IncomingHttpHeaders} header
	 *
	 * @returns {boolean}
	 */
	public hasHeader(header: keyof IncomingHttpHeaders): boolean {
		return this._headers.has(header.toString());
	}

	/**
	 * Get x header from the request/response
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @param {IncomingHttpHeaders} header
	 *
	 * @returns {string}
	 */
	public getHeader<T>(header: keyof IncomingHttpHeaders, _default:any = null): T | null {
		const headerValue = this._headers.get(header.toString(), _default);

		if (!headerValue) {
			return _default;
		}

		return headerValue as unknown as T;
	}

	/**
	 * Apply a header to the request or response, this applies directly to the fastify request/response
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @param {IncomingHttpHeaders} header
	 * @param {any} value
	 *
	 * @returns {this}
	 */
	public setHeader(header: keyof IncomingHttpHeaders, value: any): this {
		this._headers.put(header.toString(), value);

		if (this._response) {
			this._response.header(header.toString(), value);
		} else {
			console.log(`Trying to sEt header(${header}) when _response does not exist.`);
		}

		return this;
	}

	public isFastifyRequest(request: FastifyRequest | IncomingMessage): request is FastifyRequest {
		return (this._request as FastifyRequest)?.routerMethod !== undefined;
	}

	public isSocketRequest(request: FastifyRequest | IncomingMessage): request is IncomingMessage {
		return (this._request as FastifyRequest)?.routerMethod === undefined;
	}

	public get socketRequest(): IncomingMessage {
		return this.isSocketRequest(this._request) ? this._request : null;
	}

	public get fastifyRequest(): FastifyRequest {
		return this.isFastifyRequest(this._request) ? this._request : null;
	}

	/**
	 * Access Fastify's underlying response
	 *
	 * @return {FastifyReply}
	 */
	public get fastifyReply(): FastifyReply {
		return this._response;
	}

	private bindMethod(method: FastifyReply | FastifyRequest | IncomingMessage) {
		if (method instanceof Reply) {
			this._response = (<FastifyReply>method);
			return;
		}
		if (method instanceof Request) {
			this._request = <Request>method;
			return;
		}
		if (method instanceof IncomingMessage) {
			this._request = <IncomingMessage>method;
			return;
		}
	}

	private getHeaderContainerForMethod(method: FastifyReply | FastifyRequest | IncomingMessage): ObjectContainer<number | string | string[] | undefined> {
		let headers: any = {};

		if (method instanceof Reply) {
			headers = (<FastifyReply>method).getHeaders();
		}

		if (method instanceof IncomingMessage) {
			headers = method.headers;
		}

		if (method instanceof Request) {
			headers = (<FastifyRequest>method).headers;
		}

		return new ObjectContainer(headers, {
			convertAllKeysToLowerCase   : true,
			convertAllValuesToLowerCase : false,
		});
	}

	public redirectResponse(): RedirectResponseContract {
		return new RedirectResponse(this._context);
	}

	/**
	 * Flush all of the old input data from the session
	 */
	public flush() {
		this._context.session.store().flushInput([]);
	}
}
