import type {SessionStorageDriver} from "../../Session/Drivers/SessionStorageDriver";

export type CookieConfiguration = {
	path?: string;
	httpOnly?: boolean;
	secure?: boolean;
	/**
	 * How long cookies live, in seconds from when each cookie is set.
	 * Omit it for session cookies (deleted when the browser closes).
	 */
	lifetime?: number;
	domain?: string;
	sameSite?: CookieSameSiteValue;
	signed?: boolean;
	encrypted?: boolean;
	signedCookiePrefix?: string;
}

export type CookieSameSiteValue = "Strict" | "Lax" | "None"

export type SessionCookie = {
	name: string;
}

export type SessionConfiguration = {
	cookie: CookieConfiguration;
	/**
	 * Name of the cookie holding the CSRF token for JavaScript clients (default "XSRF-TOKEN").
	 * axios (and so Inertia) sends it back as an X-XSRF-TOKEN header on same-origin requests,
	 * which VerifyCsrfTokenMiddleware accepts. Set to false to not send it.
	 */
	xsrfCookie?: string | false;
	sessionCookie: SessionCookie;
	sessionStorageDriver: new () => SessionStorageDriver | null;
}
