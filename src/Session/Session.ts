import {DateTime} from "@envuso/date-time-helper";
import {config, resolve} from "../AppContainer/helpers";
import {Str} from "../Common/Utility/Str";
import type {AuthenticatableContract} from "../Contracts/Authentication/UserProvider/AuthenticatableContract";
import type {CsrfContract} from "../Contracts/Security/CsrfContract";
import type {SessionContract} from "../Contracts/Session/SessionContract";
import type {SessionStoreContract} from "../Contracts/Session/SessionStoreContract";
import type {SessionStorageDriver} from "./Drivers/SessionStorageDriver";
import {SessionStore} from "./SessionStore";

export class Session implements SessionContract {

	public driver: SessionStorageDriver;

	/**
	 * The identifier used to store information about
	 * this session in our session storage driver
	 *
	 * @type {string}
	 * @private
	 */
	public id: string;

	/**
	 * Values that we store in the session. At the end
	 * of the request, we save these values in our storage.
	 *
	 * @type {SessionStoreContract}
	 * @private
	 */
	public attributes: SessionStoreContract = null;

	public userId: string = null;

	/**
	 * Set when the id was rotated during this request (e.g. on login); the data stored
	 * under the old id is destroyed when the session is saved.
	 */
	private rotatedFromId: string = null;

	private tokenNeedsRegenerating: boolean = false;

	/**
	 * Whether our session has been initiated or not yet.
	 *
	 * @type {boolean}
	 * @private
	 */
	public started: boolean = false;

	constructor(driver: SessionStorageDriver) {
		this.driver = driver;
	}

	/**
	 * Start a fresh new session
	 *
	 * @returns {Promise<Session>}
	 */
	public async create(id?: string): Promise<Session> {
		if (this.isStarted()) {
			throw new Error('Trying to create a new session when our session is already created.');
		}

		this.setId(id);

		await this.start();

		return this;
	}

	/**
	 * Load our data from the storage provider and regenerate the session id
	 *
	 * @return {Promise<Session>}
	 * @private
	 */
	public async start(): Promise<Session> {
		await this.loadSession();

		if (!this.hasCsrfToken()) {
			await this.regenerateToken();
		}

		this.started = true;

		this.attributes.put("___sessionSetAt", DateTime.now().toTime());

		return this;
	}

	/**
	 * Load session values from the storage provider
	 *
	 * @return {Promise<void>}
	 * @private
	 */
	public async loadSession() {
		this.attributes = new SessionStore();

		const data = await this.driver.getSessionData(this.id) ?? {};

		// An id we never issued (or one that expired) gets a fresh id, so a client
		// can't choose its own session id (session fixation)
		if (Object.keys(data).length === 0) {
			this.id = this.generateSessionId();
		}

		this.attributes.populate(data);
	}

	/**
	 * Get the session identifier
	 *
	 * @returns {string}
	 */
	public getId(): string {
		return this.id;
	}

	/**
	 * Save all values in the session store on redis against the session id
	 */
	public async save(): Promise<void> {

		if (this.rotatedFromId) {
			await this.driver.destroy(this.rotatedFromId);
			this.rotatedFromId = null;
		}

		await this.regenerateTokenIfPending();

		this.attributes.ageFlashData();

		await this.driver.writeSessionData(
			this.id, this.attributes.items()
		);

	}

	/**
	 * Since the cookie name for the session is configurable we
	 * need an easier way to access it without manually
	 * checking the configuration every time.
	 *
	 * @returns {string}
	 */
	public getCookieName(): string {
		return config().get<string, any>('Session.sessionCookie.name', 'id');
	}

	/**
	 * Generate a new session identifier
	 *
	 * @param {boolean} destroy | Do we want to destroy the session & it's data also?
	 */
	public async regenerate(destroy: boolean = false) {
		await this.migrate(destroy);

		await this.regenerateToken();
	}

	/**
	 * Generate a new session ID for the session.
	 *
	 * @param {bool} destroy | Do we want to destroy the session & it's data also?
	 *
	 * @return bool
	 */
	public async migrate(destroy: boolean = false) {
		if (destroy) {
			await this.driver.destroy(this.id);
		}

		this.setId(this.generateSessionId());
	}

	/**
	 * Has this session been started yet?
	 *
	 * @return {boolean}
	 */
	public isStarted() {
		return this.started === true;
	}

	/**
	 * Set a new id for this session
	 *
	 * @param {string} id
	 * @return {Session}
	 */
	public setId(id: string): SessionContract {
		this.id = this.isValidSessionId(id) ? id : this.generateSessionId();

		return this;
	}

	/**
	 * Validate that our session id matches constraints
	 *
	 * @param id
	 * @return {boolean}
	 */
	public isValidSessionId(id: any): boolean {
		// generateSessionId() is 32 hex characters; anything else (e.g. "../" for the file driver) is rejected
		return (typeof id === 'string') && /^[a-f0-9]{32}$/i.test(id);
	}

	/**
	 * Get a random new session id string
	 *
	 * @return {string}
	 */
	public generateSessionId(): string {
		return Str.uniqueRandom(32);
	}

	/**
	 * Is the CSRF token & secret set yet?
	 *
	 * @return {boolean}
	 */
	public hasCsrfToken(): boolean {
		return this.attributes.has('_csrf.secret') && this.attributes.has('_csrf.token');
	}

	/**
	 * Get the CSRF token
	 *
	 * @return {string}
	 */
	public getCsrfToken(): string {
		return this.attributes.get('_csrf.token');
	}

	/**
	 * Get the CSRF token secret
	 *
	 * @return {string}
	 */
	public getCsrfSecret(): string {
		return this.attributes.get('_csrf.secret');
	}

	/**
	 * Generate a new CSRF secret & token
	 *
	 * @return {Promise<void>}
	 */
	/**
	 * Apply a token regeneration requested during this request (e.g. by rotateId() on login)
	 */
	public async regenerateTokenIfPending() {
		if (this.tokenNeedsRegenerating) {
			this.tokenNeedsRegenerating = false;
			await this.regenerateToken();
		}
	}

	public async regenerateToken() {
		const csrfCreator = resolve<CsrfContract>('csrf');
		const secret      = await csrfCreator.secret();

		this.attributes.put('_csrf.secret', secret);
		this.attributes.put('_csrf.token', csrfCreator.create(secret));
	}

	/**
	 * Flush all of the session data and regenerate the session id
	 *
	 * @return {Promise<void>}
	 */
	public async invalidate() {
		this.attributes.flush();

		await this.migrate(true);
	}

	public store(): SessionStoreContract {
		return this.attributes;
	}

	/**
	 * Set the authenticated user onto the session
	 *
	 * @param {AuthenticatableContract<any>} user
	 */
	public setUser(user: AuthenticatableContract<any>) {
		const userId = user?._user?._id ?? (user as any)?._id;

		// Logging in (or switching user) rotates the session id and CSRF token, so an id
		// obtained before login can't be used to ride the authenticated session
		if (String(userId) !== String(this.store().get('user_id', null))) {
			this.rotateId();
		}

		this.userId = userId;

		this.store().put('user_id', this.userId);
	}

	/**
	 * Give the session a new id, keeping its data. The old id is destroyed on save.
	 */
	public rotateId() {
		if (!this.rotatedFromId) {
			this.rotatedFromId = this.id;
		}

		this.id                     = this.generateSessionId();
		this.tokenNeedsRegenerating = true;
	}

}
