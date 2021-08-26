"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieJar = void 0;
const cookie_1 = require("cookie");
const AppContainer_1 = require("../../AppContainer");
const Common_1 = require("../../Common");
const Crypt_1 = require("../../Crypt");
const RequestContext_1 = require("./RequestContext");
const Session_1 = require("./Session");
class CookieJar {
    constructor() {
        this._jar = new Map();
        const configRepository = AppContainer_1.resolve(AppContainer_1.ConfigRepository);
        this._config = configRepository.get('session');
        this._secret = configRepository.get('app.appKey');
    }
    /**
     * Set a key/value to be added to the request as a cookie.
     *
     * @param key
     * @param value
     */
    put(key, value) {
        this._jar.set(key, value);
    }
    /**
     * Get a cookies value from the request or one that was set in the response.
     *
     * @param key
     * @param _default
     * @returns {string | null}
     */
    get(key, _default = null) {
        const cookie = this._jar.get(key);
        if (!cookie)
            return _default;
        return cookie;
    }
    /**
     * Check if X cookie has been added to the request/response
     *
     * @param key
     * @returns {boolean}
     */
    has(key) {
        return this._jar.has(key);
    }
    /**
     * Parse the cookies from the request and store them on the cookie jar
     *
     * @param {FastifyRequest} request
     * @returns {this}
     */
    setCookies(request) {
        const cookies = cookie_1.parse(request.raw.headers.cookie || '');
        for (let key of Object.keys(cookies)) {
            let value = cookies[key];
            try {
                value = Crypt_1.Encryption.decrypt(value);
            }
            catch (e) {
                Common_1.Log.error('Failed to decrypt cookie value...');
            }
            this._jar.set(key, value);
        }
        return this;
    }
    setCookiesOnResponse() {
        // const authentication = resolve(Authentication);
        //
        // if (!authentication.isUsingProvider(SessionAuthenticationProvider)) {
        // 	return;
        // }
        // if (RequestContext.response().hasHeader('Set-Cookie')) {
        //
        // 	const currentCookie = RequestContext.response().getHeader('Set-Cookie');
        //
        // 	if (typeof currentCookie === 'string') {
        //
        // 	}
        //
        // }
        if (RequestContext_1.RequestContext.isUsingSession()) {
            this._jar.set(Session_1.Session.getCookieName(), RequestContext_1.RequestContext.session().getId());
        }
        for (let key of this._jar.keys()) {
            const originalValue = this._jar.get(key);
            const value = this._config.encryptCookies ? Crypt_1.Encryption.encrypt(originalValue) : originalValue;
            const cookie = cookie_1.serialize(key, value, this._config.cookie);
            RequestContext_1.RequestContext.response().header('Set-Cookie', cookie);
        }
    }
}
exports.CookieJar = CookieJar;
//# sourceMappingURL=CookieJar.js.map