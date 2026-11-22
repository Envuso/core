import type {SessionStorageDriver} from "../../Session/Drivers/SessionStorageDriver";
import type {DateTimeContract} from "@envuso/date-time-helper";

export type CookieConfiguration = {
	path?: string;
	httpOnly?: boolean;
	secure?: boolean;
	/**
	 * How long cookies live, in seconds from when each cookie is set.
	 * Prefer this to `expires`/`maxAge`: those are fixed points in time, so a value like
	 * `DateTime.now().addDays(7)` in a config file expires 7 days after the server booted.
	 */
	lifetime?: number;
	/** @deprecated a fixed point in time; use `lifetime` */
	expires?: DateTimeContract;
	domain?: string;
	/** @deprecated a fixed point in time; use `lifetime` */
	maxAge?: DateTimeContract;
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
	sessionCookie: SessionCookie;
	sessionStorageDriver: new () => SessionStorageDriver | null;
}
