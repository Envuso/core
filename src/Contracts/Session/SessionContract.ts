import {Session} from "../../Session";
import {SessionStorageDriver} from "../../Session/Drivers/SessionStorageDriver";
import {AuthenticatableContract} from "../Authentication/UserProvider/AuthenticatableContract";
import {SessionStoreContract} from "./SessionStoreContract";

export interface SessionContract {
	driver: SessionStorageDriver;
	id: string;
	attributes: SessionStoreContract;
	userId: string;
	started: boolean;

	/**
	 * Start a fresh new session
	 *
	 * @returns {Promise<Session>}
	 */
	create(id?: string): Promise<Session>;

	/**
	 * Load our data from the storage provider and regenerate the session id
	 *
	 * @return {Promise<Session>}
	 * @private
	 */
	start(): Promise<Session>;

	/**
	 * Load session values from the storage provider
	 *
	 * @return {Promise<void>}
	 * @private
	 */
	loadSession(): Promise<void>;

	/**
	 * Get the session identifier
	 *
	 * @returns {string}
	 */
	getId(): string;

	/**
	 * Save all values in the session store on redis against the session id
	 */
	save(): Promise<void>;

	/**
	 * Since the cookie name for the session is configurable we
	 * need an easier way to access it without manually
	 * checking the configuration every time.
	 *
	 * @returns {string}
	 */
	getCookieName(): string;

	/**
	 * Generate a new session identifier
	 *
	 * @param {boolean} destroy | Do we want to destroy the session & it's data also?
	 */
	regenerate(destroy: boolean): Promise<void>;

	/**
	 * Generate a new session ID for the session.
	 *
	 * @param {bool} destroy | Do we want to destroy the session & it's data also?
	 *
	 * @return bool
	 */
	migrate(destroy: boolean): Promise<void>;

	/**
	 * Has this session been started yet?
	 *
	 * @return {boolean}
	 */
	isStarted(): boolean;

	/**
	 * Set a new id for this session
	 *
	 * @param {string} id
	 * @return {Session}
	 */
	setId(id: string): SessionContract;

	/**
	 * Validate that our session id matches constraints
	 *
	 * @param id
	 * @return {boolean}
	 */
	isValidSessionId(id: any): boolean;

	/**
	 * Get a random new session id string
	 *
	 * @return {string}
	 */
	generateSessionId(): string;

	/**
	 * Is the CSRF token & secret set yet?
	 *
	 * @return {boolean}
	 */
	hasCsrfToken(): boolean;

	/**
	 * Get the CSRF token
	 *
	 * @return {string}
	 */
	getCsrfToken(): string;

	/**
	 * Get the CSRF token secret
	 *
	 * @return {string}
	 */
	getCsrfSecret(): string;

	/**
	 * Generate a new CSRF secret & token
	 *
	 * @return {Promise<void>}
	 */
	regenerateToken(): Promise<void>;

	/**
	 * Flush all of the session data and regenerate the session id
	 *
	 * @return {Promise<void>}
	 */
	invalidate(): Promise<void>;

	store(): SessionStoreContract;

	setUser(user: AuthenticatableContract<any>): void;
}
