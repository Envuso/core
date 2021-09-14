import {FastifyReply} from "fastify";
import {resolve} from "../../../AppContainer";
import {Log, StatusCodes} from "../../../Common";
import {renderableExceptionData} from "../../../Common/Exception/ExceptionHelpers";
import {CookieContract} from "../../../Contracts/Cookies/CookieContract";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {RedirectResponseContract} from "../../../Contracts/Routing/Context/Response/RedirectResponseContract";
import {ResponseContract} from "../../../Contracts/Routing/Context/Response/ResponseContract";
import {ViewManagerContract} from "../../../Contracts/Routing/Views/ViewManagerContract";
import {ViewManager} from "../../Views/ViewManager";
import {RequestResponseContext} from "../RequestResponseContext";

export class Response extends RequestResponseContext implements ResponseContract {
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

	constructor(context: RequestContextContract, response: FastifyReply) {
		super(context, response);
	}

	/**
	 * Set the response code
	 *
	 * @param {StatusCodes} code
	 */
	set code(code: StatusCodes) {
		this._code = code;
	}

	/**
	 * Set the response data
	 *
	 * @param data
	 */
	set data(data: any) {
		this._data = data;
	}

	/**
	 * Get the response status code
	 *
	 * @return {StatusCodes}
	 */
	get code(): StatusCodes {
		return this._code ?? 200;
	}

	/**
	 * Get the data defined on the response
	 *
	 * @return {any}
	 */
	get data(): any {
		return this._data ?? {};
	}

	/**
	 * Render the view template, set the content-type on the response and prepare the response code/data
	 *
	 * @param {string} templatePath
	 * @param data
	 *
	 * @returns {ResponseContract}
	 */
	view(templatePath: string, data?: any): ResponseContract {
		const viewManager = resolve<ViewManagerContract>('ViewManager');

		let html = null;

		try {
			html = viewManager.render(templatePath, data);
		} catch (error) {
			Log.exception('Failed to render view: ', error);
			html = viewManager.render('Exceptions/exception', renderableExceptionData(500, error));
		}
		this.setHeader('Content-Type', 'text/html; charset=utf-8');

		this.setResponse(html, 200);

		return this;
	}

	/**
	 * Set the data & status code to return
	 *
	 * @param data
	 * @param code
	 *
	 * @returns {ResponseContract}
	 */
	setResponse(data: any, code: StatusCodes): ResponseContract {
		this._data = data;
		this._code = code;

		return this;
	}

	/**
	 * Set the status code... can be chained with other methods.
	 *
	 * @param code
	 *
	 * @returns {ResponseContract}
	 */
	setCode(code: StatusCodes): ResponseContract {
		this._code = code;

		return this;
	}

	/**
	 * Send the data/status code manually
	 */
	send(): FastifyReply {
		return this.fastifyReply
			.status(this.code)
			.send(this.data);
	}

	/**
	 * Send a redirect response to x url
	 *
	 * @param url
	 *
	 * @returns {RedirectResponseContract}
	 */
	redirect(url: string): RedirectResponseContract {
		return this.redirectResponse().to(url);
	}

	redirectNow(url: string) {
		this.fastifyReply.redirect(url);
	}

	/**
	 * Send a redirect response to an internal application route
	 *
	 * @param {T} routeStr
	 * @param attributes
	 * @return {RedirectResponseContract}
	 */
	public route<T extends string>(routeStr: T, attributes?: any): RedirectResponseContract {
		return this.redirectResponse().route(routeStr, attributes);
	}

	/**
	 * Send a not found response
	 *
	 * @param {string|undefined} message
	 * @param {Error|undefined} error
	 *
	 * @returns {ResponseContract}
	 */
	notFound(message?: string, error?: Error): ResponseContract {
		return this.negotiatedErrorView({message}, StatusCodes.NOT_FOUND, error);
	}

	/**
	 * Send an internal server error response
	 *
	 * @param {string|undefined} message
	 * @param {Error|undefined} error
	 *
	 * @returns {ResponseContract}
	 */
	internalError(message?: string, error?: Error): ResponseContract {
		return this.negotiatedErrorView({message}, StatusCodes.INTERNAL_SERVER_ERROR, error);
	}

	/**
	 * Send a bad request response
	 *
	 * @param data
	 * @param {Error|undefined} error
	 *
	 * @returns {ResponseContract}
	 */
	badRequest(data?: any, error?: Error): ResponseContract {
		return this.negotiatedErrorView(data, StatusCodes.BAD_REQUEST, error);
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
	 *
	 * @returns {ResponseContract}
	 */
	json(data?: any, code?: StatusCodes): ResponseContract {
		return this.setResponse(data || {}, code || StatusCodes.ACCEPTED);
	}

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
	negotiated(jsonData: any, templateData: { templatePath: string, data?: any }, statusCode?: number) {
		return this._context.request.wantsJson()
			? this.json(jsonData, statusCode)
			: this.view(templateData.templatePath, templateData.data);
	}

	/**
	 * Extends the regular negotiated method, except this time, we're going to try automate handling errors.
	 *
	 * @param jsonData
	 * @param {number} statusCode
	 * @param {Error} error
	 * @return {ResponseContract}
	 */
	negotiatedErrorView(jsonData: any, statusCode: number, error?: Error) {
		const data = {
			...(jsonData || {}),
			...renderableExceptionData(statusCode, error)
		};

		return this._context.request.wantsJson()
			? this.json(data, statusCode)
			: this.view('Exceptions/exception', data);
	}

	/**
	 * Flash some data onto the session whilst re-directing
	 *
	 * @param {string} key
	 * @param value
	 * @returns {ResponseContract}
	 */
	public with(key: string, value: any): ResponseContract {
		if (this._context.hasSession()) {
			this._context.session.store().flash(key, value);
		}

		return this;
	}

	/**
	 * Add a cookie to the response via an instance of a Cookie
	 *
	 * @param {CookieContract<any>} key
	 * @returns {ResponseContract}
	 */
	public withCookie(key: CookieContract<any>): ResponseContract;
	/**
	 * Add a cookie to the response using key/value
	 *
	 * @param {string} key
	 * @param value
	 * @returns {ResponseContract}
	 */
	public withCookie(key: string, value: any): ResponseContract;

	/**
	 * Add a cookie to the response
	 *
	 * @param {string|CookieContract} key
	 * @param value
	 * @returns {ResponseContract}
	 */
	public withCookie(key: string | CookieContract<any>, value?: any): ResponseContract {
		if (typeof key === 'string') {
			this._cookieJar.put(key, value);
		} else {
			this._cookieJar.put(key.name, key, key.signed);
		}

		return this;
	}

}
