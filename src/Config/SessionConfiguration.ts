import {DateTime} from "@envuso/date-time-helper";
import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {CookieConfiguration, SessionConfiguration as SessionConfig, SessionCookie} from "../Contracts/Session/Types";
import {FileSessionDriver} from "../Session/Drivers/FileSessionDriver";
import {RedisSessionDriver} from "../Session/Drivers/RedisSessionDriver";
import {SessionStorageDriver} from "../Session/Drivers/SessionStorageDriver";


export default class SessionConfiguration extends ConfigurationCredentials implements SessionConfig {

	/**
	 * All cookies are stored by default with this configuration
	 */
	cookie: CookieConfiguration = {
		path      : '/',
		httpOnly  : false,
		secure    : false,
		expires   : DateTime.now().addYears(5),
		maxAge    : DateTime.now().addYears(5),
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
