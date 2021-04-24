import { CookieJar } from "./CookieJar";
export declare class Session {
    private sessionId;
    private store;
    constructor(sessionId: string);
    /**
     * When we create the session from the session id, we
     * need to pull the values that were stored in redis.
     *
     * @private
     */
    private getSessionStore;
    /**
     * Get the session identifier
     *
     * @returns {string}
     */
    getId(): string;
    /**
     * Get a value from the session store
     *
     * @param {string} key
     * @param _default
     * @returns {T}
     */
    get<T>(key: string, _default?: any): T;
    /**
     * Put a value into the session store
     *
     * @param {string} key
     * @param value
     */
    put(key: string, value: any): void;
    /**
     * Remove a value from the sesion store
     *
     * @param {string} key
     */
    remove(key: string): void;
    /**
     * Clear the session
     *
     * @returns {Promise<void>}
     */
    clear(): Promise<void>;
    /**
     * Save all values in the session store on redis against the session id
     */
    save(): Promise<void>;
    /**
     * Start a fresh new session
     *
     * @returns {Session}
     */
    static create(): Session;
    /**
     * If we have a session cookie set, we'll return the previous instance of that from
     * redis using it's id. If we don't, we'll create a new session and return it
     *
     * @param {CookieJar} cookieJar
     * @return Session
     */
    static prepare(cookieJar: CookieJar): Promise<Session>;
    /**
     * Since the cookie name for the session is configurable we
     * need an easier way to access it without manually
     * checking the configuration every time.
     *
     * @returns {string}
     */
    static getCookieName(): string;
}
