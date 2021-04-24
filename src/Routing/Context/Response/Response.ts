import {FastifyReply, FastifyRequest} from "fastify";
import {StatusCodes} from "http-status-codes";
import {CookieJar} from "../CookieJar";

export class Response {

	/**
	 * Hold the original fastify reply so we can access/use it when needed
	 * @private
	 */
	private readonly _response: FastifyReply;
	/**
	 * The data to be sent in this response
	 * @private
	 */
	private _data: any;
	/**
	 * The response code to be sent
	 * @private
	 */
	private _code?: number | StatusCodes;

	/**
	 * Handles all cookies that will be sent on the request
	 *
	 * @type {CookieJar}
	 * @private
	 */
	private _cookieJar: CookieJar;

	constructor(response: FastifyReply) {
		this._response  = response;
		this._cookieJar = new CookieJar();
	}

	get fastifyReply() {
		return this._response;
	}

	cookieJar(): CookieJar {
		return this._cookieJar;
	}

	set code(code: StatusCodes) {
		this._code = code;
	}

	set data(data: any) {
		this._data = data;
	}

	get code() {
		return this._code ?? 200;
	}

	get data() {
		return this._data ?? {};
	}

	/**
	 * Do we have x header set on the response?
	 *
	 * @param {string} header
	 * @returns {boolean}
	 */
	hasHeader(header: string) {
		return this.fastifyReply.hasHeader(header);
	}

	/**
	 * Get x header from the response
	 *
	 * @param {string} header
	 * @returns {string}
	 */
	getHeader(header: string) {
		return this.fastifyReply.getHeader(header);
	}

	/**
	 * Apply a header to the response, this applies directly to the fastify response
	 *
	 * @param header
	 * @param value
	 */
	header(header: string, value: any) {
		this.fastifyReply.header(header, value);

		return this;
	}

	/**
	 * Set the data & status code to return
	 *
	 * @param data
	 * @param code
	 */
	setResponse(data: any, code: StatusCodes) {
		this._data = data;
		this._code = code;

		return this;
	}

	/**
	 * Set the status code... can be chained with other methods.
	 *
	 * @param code
	 */
	setCode(code: StatusCodes) {
		this._code = code;

		return this;
	}

	/**
	 * Send the data/status code manually
	 */
	send() {
		return this.fastifyReply
			.status(this.code)
			.send(this.data);
	}

	/**
	 * Send a redirect response to x url
	 *
	 * @param url
	 */
	redirect(url: string) {
		return this
			.setResponse(null, StatusCodes.TEMPORARY_REDIRECT)
			.header('Location', url);
	}

	/**
	 * Send a not found response
	 *
	 * @param data
	 */
	notFound(data?: any) {
		return this.setResponse(data, StatusCodes.NOT_FOUND);
	}

	/**
	 * Send a bad request response
	 *
	 * @param data
	 */
	badRequest(data?: any) {
		return this.setResponse(data, StatusCodes.BAD_REQUEST);
	}

	//	/**
	//	 * Send a validation failure response
	//	 * NOTE: This will throw a {@see ValidationException}, just to keep things structured.
	//	 * @param data
	//	 */
	//	validationFailure(data?: any) {
	//		throw new ValidationException(data);
	////		return this.setResponse(data, StatusCodes.UNPROCESSABLE_ENTITY);
	//	}

	/**
	 * Return json data
	 *
	 * @param data
	 * @param code
	 */
	json(data?: any, code?: StatusCodes) {
		return this.setResponse(data || {}, code || StatusCodes.ACCEPTED);
	}


}
