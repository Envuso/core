import { CookieConfiguration, SessionCookie } from "../../Contracts/Session/Types";
import { SessionStorageDriver } from "../../Session/Drivers/SessionStorageDriver";

export interface SessionConfigurationInterface {
    /**
     * All cookies are stored by default with this configuration
     */
    cookie: CookieConfiguration;
    /**
     * The driver used to handle session data
     *
     * Available drivers are:
     *   - RedisSessionDriver
     *      - Import: ../Session/Drivers/RedisSessionDriver
     *   - FileSessionDriver
     *      - Import: ../Session/Drivers/FileSessionDriver
     */
    sessionStorageDriver: new () => SessionStorageDriver | null;
    /**
     * Configuration for session cookies
     * These settings affect how SessionAuthenticationProvider works.
     */
    sessionCookie: SessionCookie;
}
