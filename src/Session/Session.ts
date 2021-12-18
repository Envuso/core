import {config, resolve} from "../AppContainer";
import {Str} from "../Common";
import {AuthenticatableContract} from "../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {CsrfContract} from "../Contracts/Security/CsrfContract";
import {SessionContract} from "../Contracts/Session/SessionContract";
import {SessionStoreContract} from "../Contracts/Session/SessionStoreContract";
import {SessionStorageDriver} from "./Drivers/SessionStorageDriver";
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

		this.attributes.populate(
			await this.driver.getSessionData(this.id)
		);
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
		return (typeof id === 'string') && id.length === 32;
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
		this.userId = user?._user?._id ?? (user as any)._id;

		this.store().put('user_id', this.userId);
	}

}
