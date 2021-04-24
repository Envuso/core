"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const AppContainer_1 = require("../../AppContainer");
const Common_1 = require("../../Common");
const Database_1 = require("../../Database");
class Session {
    constructor(sessionId) {
        this.store = new Map();
        this.sessionId = sessionId;
    }
    /**
     * When we create the session from the session id, we
     * need to pull the values that were stored in redis.
     *
     * @private
     */
    getSessionStore() {
        return __awaiter(this, void 0, void 0, function* () {
            const storedValues = yield Database_1.Redis.get(this.sessionId);
            if (!storedValues) {
                return;
            }
            for (let key of Object.keys(storedValues)) {
                this.store.set(key, storedValues[key]);
            }
        });
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
    get(key, _default = null) {
        const value = this.store.get(key);
        if (value === undefined) {
            return _default;
        }
        return value;
    }
    /**
     * Put a value into the session store
     *
     * @param {string} key
     * @param value
     */
    put(key, value) {
        this.store.set(key, value);
    }
    /**
     * Remove a value from the sesion store
     *
     * @param {string} key
     */
    remove(key) {
        this.store.delete(key);
    }
    /**
     * Clear the session
     *
     * @returns {Promise<void>}
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.store = new Map();
            yield Database_1.Redis.remove(this.sessionId);
        });
    }
    /**
     * Save all values in the session store on redis against the session id
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionValues = {};
            for (let key of this.store.keys()) {
                sessionValues[key] = this.store.get(key);
            }
            yield Database_1.Redis.put(this.sessionId, sessionValues);
        });
    }
    /**
     * Start a fresh new session
     *
     * @returns {Session}
     */
    static create() {
        return new Session(Common_1.Str.uniqueRandom(32));
    }
    /**
     * If we have a session cookie set, we'll return the previous instance of that from
     * redis using it's id. If we don't, we'll create a new session and return it
     *
     * @param {CookieJar} cookieJar
     * @return Session
     */
    static prepare(cookieJar) {
        return __awaiter(this, void 0, void 0, function* () {
            if (cookieJar.has(this.getCookieName())) {
                const session = new Session(cookieJar.get(this.getCookieName()));
                yield session.getSessionStore();
                return session;
            }
            return this.create();
        });
    }
    /**
     * Since the cookie name for the session is configurable we
     * need an easier way to access it without manually
     * checking the configuration every time.
     *
     * @returns {string}
     */
    static getCookieName() {
        return AppContainer_1.config('session.cookieName', 'sessionId');
    }
}
exports.Session = Session;
//# sourceMappingURL=Session.js.map