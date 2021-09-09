import {Url} from "../../../Common/Utility/Url";
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
		this.redirectTo = Url.routeUrl<T>(controllerAndMethod, attributes);

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

}
