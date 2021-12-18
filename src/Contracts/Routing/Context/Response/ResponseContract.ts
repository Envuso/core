import {FastifyReply} from "fastify";
import {IncomingHttpHeaders} from "http";
import {StatusCodes} from "../../../../Common";
import {CookieContract} from "../../../Cookies/CookieContract";
import {RequestResponseContextContract} from "../RequestResponseContextContract";
import {RedirectResponseContract} from "./RedirectResponseContract";

export interface ResponseContract extends RequestResponseContextContract {

	code: StatusCodes;
	data: any;

	/**
	 * Render the view template, set the content-type on the response and prepare the response code/data
	 *
	 * @param {string} templatePath
	 * @param data
	 *
	 * @returns {ResponseContract}
	 */
	view(templatePath: string, data?: any): ResponseContract;

	/**
	 * Set the data & status code to return
	 *
	 * @param data
	 * @param code
	 *
	 * @returns {ResponseContract}
	 */
	setResponse(data: any, code: StatusCodes): ResponseContract;

	/**
	 * Set the status code... can be chained with other methods.
	 *
	 * @param code
	 *
	 * @returns {ResponseContract}
	 */
	setCode(code: StatusCodes): ResponseContract;

	/**
	 * Send the data/status code manually
	 */
	send(): FastifyReply;

	/**
	 * Send a redirect response to x url
	 *
	 * @param url
	 *
	 * @returns {RedirectResponseContract}
	 */
	redirect(url: string): RedirectResponseContract;

	redirectNow(url: string): void;

	/**
	 * Send a redirect response to an internal application route
	 *
	 * @template T
	 * @param {T} routeStr
	 * @param attributes
	 * @return {RedirectResponseContract}
	 */
	route<T extends string>(routeStr: T, attributes?: any): RedirectResponseContract;

	/**
	 * Send a not found response
	 *
	 * @param {string|undefined} message
	 * @param {Error|undefined} error
	 *
	 * @returns {ResponseContract}
	 */
	notFound(message?: string, error?: Error): ResponseContract;

	/**
	 * Send an internal server error response
	 *
	 * @param {string|undefined} message
	 * @param {Error|undefined} error
	 *
	 * @returns {ResponseContract}
	 */
	internalError(message?: string, error?: Error): ResponseContract;

	/**
	 * Send a bad request response
	 *
	 * @param data
	 * @param {Error|undefined} error
	 *
	 * @returns {ResponseContract}
	 */
	badRequest(data?: any, error?: Error): ResponseContract;

	/**
	 * Return json data
	 *
	 * @param data
	 * @param code
	 *
	 * @returns {ResponseContract}
	 */
	json(data?: any, code?: StatusCodes): ResponseContract;

	/**
	 * Allows us to optionally define dynamic response types based on Accept/Content-Type headers.
	 *
	 * If our Accept & Content-Type on the request is application/json. We'll send a json response.
	 * If our Accept & Content-Type on the request is text/html. We'll send a html response.
	 *
	 * @param jsonData
	 * @param {{templatePath: string, data?: any}} templateData
	 * @param {number} statusCode
	 * @return {ResponseContract}
	 */
	negotiated(jsonData: any, templateData: { templatePath: string, data?: any }, statusCode?: number);

	/**
	 * Extends the regular negotiated method, except this time, we're going to try automate handling errors.
	 *
	 * @param jsonData
	 * @param {number} statusCode
	 * @param {Error} error
	 * @return {ResponseContract}
	 */
	negotiatedErrorView(jsonData: any, statusCode: number, error?: Error);

	/**
	 * Flash some data onto the session whilst re-directing
	 *
	 * @param {string} key
	 * @param value
	 * @returns {ResponseContract}
	 */
	with(key: string, value: any): ResponseContract;

	/**
	 * Add a cookie to the response via an instance of a Cookie
	 *
	 * @param {CookieContract<any>} key
	 * @returns {ResponseContract}
	 */
	withCookie(key: CookieContract<any>): ResponseContract;

	/**
	 * Add a cookie to the response using key/value
	 *
	 * @param {string} key
	 * @param value
	 * @returns {ResponseContract}
	 */
	withCookie(key: string, value: any): ResponseContract;

	/**
	 * Add a cookie to the response
	 *
	 * @param {string|CookieContract} key
	 * @param value
	 * @returns {ResponseContract}
	 */
	withCookie(key: string | CookieContract<any>, value?: any): ResponseContract;

	withHeader(header: keyof IncomingHttpHeaders, value: any): ResponseContract
}
