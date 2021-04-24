import {config} from "../../AppContainer";
import {Str} from "../../Common";
import {Redis} from "../../Database";
import {CookieJar} from "./CookieJar";

export class Session {
	private sessionId: string;
	private store: Map<string, any> = new Map();

	constructor(sessionId: string) {
		this.sessionId = sessionId;
	}

	/**
	 * When we create the session from the session id, we
	 * need to pull the values that were stored in redis.
	 *
	 * @private
	 */
	private async getSessionStore() {
		const storedValues = await Redis.get(this.sessionId);

		if (!storedValues) {
			return;
		}

		for (let key of Object.keys(storedValues)) {
			this.store.set(key, storedValues[key]);
		}
	}

	/**
	 * Get the session identifier
	 *
	 * @returns {string}
	 */
	getId() {
		return this.sessionId;
	}

	/**
	 * Get a value from the session store
	 *
	 * @param {string} key
	 * @param _default
	 * @returns {T}
	 */
	get<T>(key: string, _default: any = null): T {
		const value = this.store.get(key);

		if (value === undefined) {
			return _default as T;
		}

		return value as T;
	}

	/**
	 * Put a value into the session store
	 *
	 * @param {string} key
	 * @param value
	 */
	put(key: string, value: any) {
		this.store.set(key, value);
	}

	/**
	 * Remove a value from the sesion store
	 *
	 * @param {string} key
	 */
	remove(key: string) {
		this.store.delete(key);
	}

	/**
	 * Clear the session
	 *
	 * @returns {Promise<void>}
	 */
	async clear() {
		this.store = new Map();

		await Redis.remove(this.sessionId);
	}

	/**
	 * Save all values in the session store on redis against the session id
	 */
	async save() {
		const sessionValues = {};

		for (let key of this.store.keys()) {
			sessionValues[key] = this.store.get(key);
		}

		await Redis.put(this.sessionId, sessionValues);
	}

	/**
	 * Start a fresh new session
	 *
	 * @returns {Session}
	 */
	static create() {
		return new Session(Str.uniqueRandom(32));
	}

	/**
	 * If we have a session cookie set, we'll return the previous instance of that from
	 * redis using it's id. If we don't, we'll create a new session and return it
	 *
	 * @param {CookieJar} cookieJar
	 * @return Session
	 */
	public static async prepare(cookieJar: CookieJar): Promise<Session> {
		if (cookieJar.has(this.getCookieName())) {
			const session = new Session(cookieJar.get(this.getCookieName()));
			await session.getSessionStore();

			return session;
		}

		return this.create();
	}

	/**
	 * Since the cookie name for the session is configurable we
	 * need an easier way to access it without manually
	 * checking the configuration every time.
	 *
	 * @returns {string}
	 */
	static getCookieName(): string {
		return config<string>('session.cookieName', 'sessionId');
	}
}
