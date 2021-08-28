import {DateTime} from "../Common";
import {CookieConfiguration} from "../Routing";

export type SessionCookie = {
	name : string;
	encrypt : boolean;
}

export type SessionConfiguration = {
	cookie: CookieConfiguration;
	sessionCookie : SessionCookie;
}

export default {

	/**
	 * Cookie configuration for https://npmjs.com/package/cookie
	 */
	cookie : {
		path     : '/',
		httpOnly : false,
		secure   : true,
		expires  : DateTime.now().addYears(5).toDate(),
		sameSite : true,
		domain   : null,
	},

	/**
	 * Configuration for session cookies
	 * These settings affect how SessionAuthenticationProvider works.
	 */
	sessionCookie : {
		name    : 'sessionId',
		encrypt : true,
	},

	/**
	 * The cookie name for identifying a session
	 */
	sessionCookieName : 'session',

	/**
	 *
	 */
	encryptCookies : true,

} as SessionConfiguration;
