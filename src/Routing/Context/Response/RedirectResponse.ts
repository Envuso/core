import {ObjectContainer} from "../../../Common";
import {CookieContract} from "../../../Contracts/Cookies/CookieContract";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {RedirectResponseContract} from "../../../Contracts/Routing/Context/Response/RedirectResponseContract";
import {session} from "../../../Session";

export class RedirectResponse implements RedirectResponseContract {

	private _context: RequestContextContract;


	constructor(_context: RequestContextContract) {
		this._context = _context;
	}

	/**
	 * The url we're going to redirect to when our request is complete.
	 *
	 * @type {string}
	 * @private
	 */
	private redirectTo: string = null;

	/**
	 * Redirect to an internal application route
	 *
	 * @param {T} controllerAndMethod
	 * @param attributes
	 * @return {RedirectResponseContract}
	 */
	public route<T extends string>(controllerAndMethod: T, attributes?: any): RedirectResponseContract {
		this.redirectTo = this._context.request.getUrlGenerator().generateUrlForRoute<T>(
			controllerAndMethod, attributes
		);

		return this;
	}

	/**
	 * Redirect away from the site to somewhere external (google.com for ex)
	 *
	 * @param {string} url
	 * @return {RedirectResponseContract}
	 */
	public to(url: string): RedirectResponseContract {
		this.redirectTo = url;

		return this;
	}

	/**
	 * Redirect away from the site to somewhere external (google.com for ex)
	 *
	 * @param {string} url
	 * @return {RedirectResponseContract}
	 */
	public away(url: string): RedirectResponseContract {
		return this.to(url);
	}

	/**
	 * Flash a key/value with this redirect
	 *
	 * @param {string} key
	 * @param value
	 * @return {RedirectResponseContract}
	 */
	public with(key: string, value: any): RedirectResponseContract {
		session().store().flash(key, value);

		return this;
	}

	/**
	 * Flash an object or key->value values to the session
	 *
	 * Leave input empty to flash all of the current requests input to the session
	 *
	 * @param input
	 * @return {RedirectResponseContract}
	 */
	public withInput(input?: any): RedirectResponseContract {
		if (input === undefined || input === null) {
			this._context.session.store().flashInput(
				this._context.request.all()
			);

			return this;
		}

		this._context.session.store().flashInput(input);

		return this;
	}

	public getRedirectUrl(): string | null {
		return this.redirectTo;
	}

	/**
	 * Add a cookie to the response via an instance of a Cookie
	 *
	 * @param {CookieContract<any>} key
	 * @returns {RedirectResponseContract}
	 */
	public withCookie(key: CookieContract<any>): RedirectResponseContract;
	/**
	 * Add a cookie to the response using key/value
	 *
	 * @param {string} key
	 * @param value
	 * @returns {RedirectResponseContract}
	 */
	public withCookie(key: string, value: any): RedirectResponseContract;

	/**
	 * Add a cookie to the response
	 *
	 * @param {string|CookieContract} key
	 * @param value
	 * @returns {RedirectResponseContract}
	 */
	public withCookie(key: string | CookieContract<any>, value?: any): RedirectResponseContract {
		if (typeof key === 'string') {
			this._context.response._cookieJar.put(key, value);
		} else {
			this._context.response._cookieJar.put(key.name, key, key.signed);
		}

		return this;
	}

	/**
	 * Return a redirect to the previous url
	 *
	 * @returns {RedirectResponseContract}
	 */
	public back(): RedirectResponseContract {
		this.redirectTo = this._context.request.getPreviousUrl();

		return this;
	}
}
