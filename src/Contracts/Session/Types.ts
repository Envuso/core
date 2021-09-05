import {SessionStorageDriver} from "../../Session/Drivers/SessionStorageDriver";
import {DateTimeContract} from "../Common/Utility/DateTimeContract";

export type CookieConfiguration = {
	path?: string;
	httpOnly?: boolean;
	secure?: boolean;
	expires?: DateTimeContract;
	domain?: string;
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
