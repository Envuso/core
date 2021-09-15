import {FastifyReply, FastifyRequest} from "fastify";
import {IncomingHttpHeaders, IncomingMessage} from "http";
import {ObjectContainer, ObjectContainerObject} from "../../../Common";
import {UrlGenerator} from "../../../Routing/Route/UrlGenerator";
import {CookieJarContract} from "../../Cookies/CookieJarContract";
import {RedirectResponseContract} from "./Response/RedirectResponseContract";

export interface RequestResponseContextContract {
	_response: FastifyReply;
	_request: FastifyRequest | IncomingMessage;
	_cookieJar: CookieJarContract;
	_headers: ObjectContainer<number | string | string[] | undefined>;
	readonly socketRequest: IncomingMessage;
	readonly fastifyRequest: FastifyRequest;
	readonly fastifyReply: FastifyReply;

	/**
	 * Override the cookie jar.
	 * We initialise the jar from outside of the response in the context.
	 *
	 * We then set the jar on the request and response.
	 *
	 * @param {CookieJarContract} jar
	 * @return {this}
	 */
	setCookieJar(jar: CookieJarContract): this;

	/**
	 * Get the response cookie handler
	 *
	 * @return {CookieJarContract}
	 */
	cookieJar(): CookieJarContract;

	/**
	 * Get all headers defined on the request/response
	 *
	 * @return {ObjectContainerObject<number | string | string[] | undefined>}
	 */
	headers(): ObjectContainerObject<number | string | string[] | undefined>;

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
	hasHeader(header: keyof IncomingHttpHeaders): boolean;

	/**
	 * Get x header from the request/response
	 *
	 * Envuso Request and Response classes both extend this class so that they share a
	 * similar interface without mass code duplication.
	 *
	 * @param {IncomingHttpHeaders} header
	 *
	 * @param _default
	 * @returns {string}
	 */
	getHeader<T>(header: keyof IncomingHttpHeaders, _default?:any): T | null;

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
	setHeader(header: keyof IncomingHttpHeaders, value: any): this;

	isFastifyRequest(request: FastifyRequest | IncomingMessage): request is FastifyRequest;

	isSocketRequest(request: FastifyRequest | IncomingMessage): request is IncomingMessage;

	redirectResponse(): RedirectResponseContract;

	/**
	 * Flush all of the old input data from the session
	 */
	flush():void;

	/**
	 * Get an instance of the UrlGenerator
	 *
	 * @returns {UrlGenerator}
	 */
	getUrlGenerator(): UrlGenerator;

	/**
	 * Get the previous request url
	 *
	 * @returns {string}
	 */
	getPreviousUrl(): string;
}
