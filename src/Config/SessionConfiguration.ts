import Environment from "../AppContainer/Config/Environment";
import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import type {CookieConfiguration, SessionConfiguration as SessionConfig, SessionCookie} from "../Contracts/Session/Types";
import {FileSessionDriver} from "../Session/Drivers/FileSessionDriver";
import {RedisSessionDriver} from "../Session/Drivers/RedisSessionDriver";
import type {SessionStorageDriver} from "../Session/Drivers/SessionStorageDriver";


export default class SessionConfiguration extends ConfigurationCredentials implements SessionConfig {

	/**
	 * All cookies are stored by default with this configuration
	 */
	cookie: CookieConfiguration = {
		path      : '/',
		httpOnly  : true,
		// HTTPS only in production
		secure    : Environment.isProduction(),
		// seconds, counted from when each cookie is set
		lifetime  : 60 * 60 * 24 * 7,
		sameSite  : "Lax",
		signed    : true,
		encrypted : true,
		// domain   : null,
	};

	/**
	 * The driver used to handle session data
	 *
	 * Available drivers are:
	 *   - RedisSessionDriver
	 *      - Import: ../Session/Drivers/RedisSessionDriver
	 *   - FileSessionDriver
	 *      - Import: ../Session/Drivers/FileSessionDriver
	 */
	//	sessionStorageDriver: new () => SessionStorageDriver | null = FileSessionDriver;
	sessionStorageDriver: new () => SessionStorageDriver | null = RedisSessionDriver;

	/**
	 * Configuration for session cookies
	 * These settings affect how SessionAuthenticationProvider works.
	 */
	sessionCookie: SessionCookie = {
		name : 'sessionId',
	};

}
