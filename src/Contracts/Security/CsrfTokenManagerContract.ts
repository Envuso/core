import {RequestContextContract} from "../Routing/Context/RequestContextContract";

export interface CsrfTokenManagerContract {

	/**
	 * Generate a new csrf secret and a token based on this secret
	 * For every new request that hits our application, we should
	 * create a new secret and generate a new token from this.
	 *
	 * @return {Promise<void>}
	 */
	rotateCsrfToken();

	/**
	 * Get the current csrf token
	 *
	 * @return {string}
	 */
	getCsrfToken(): string;


	/**
	 * Validate the token we've passed against the secret stored in the session.
	 *
	 * @return {boolean}
	 */
	tokenIsValid(): boolean;

	/**
	 * Look in the request for the token passed via a form
	 * The X-XSRF-TOKEN, and the X-CSRF-TOKEN.
	 *
	 * For those that are defined, we will validate these
	 * against our stored secret for this request.
	 *
	 * @param {RequestContextContract} context
	 */
	setTokensFromContext(context: RequestContextContract): void;
}
