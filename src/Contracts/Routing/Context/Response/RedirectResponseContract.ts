//import {ApplicationRouteAttributeObject} from "../../../../Meta/ApplicationRouteMeta";

export interface RedirectResponseContract {
	/**
	 * Redirect to an internal application route
	 *
	 * @template T
	 * @param {T} controllerAndMethod
	 * @param attributes
	 * @return {RedirectResponseContract}
	 */
	route<T extends string>(controllerAndMethod: T, attributes?: any): RedirectResponseContract;

	/**
	 * Redirect away from the site to somewhere external (google.com for ex)
	 *
	 * @param {string} url
	 * @return {RedirectResponseContract}
	 */
	to(url: string): RedirectResponseContract;

	/**
	 * Redirect away from the site to somewhere external (google.com for ex)
	 *
	 * @param {string} url
	 * @return {RedirectResponseContract}
	 */
	away(url: string): RedirectResponseContract;

	/**
	 * Flash a key/value with this redirect
	 *
	 * @param {string} key
	 * @param value
	 * @return {RedirectResponseContract}
	 */
	with(key: string, value: any): RedirectResponseContract;

	/**
	 * Flash an object or key->value values to the session
	 *
	 * Leave input empty to flash all of the current requests input to the session
	 *
	 * @param input
	 * @return {RedirectResponseContract}
	 */
	withInput(input?: any): RedirectResponseContract

	getRedirectUrl(): string | null;

}
