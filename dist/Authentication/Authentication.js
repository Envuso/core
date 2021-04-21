"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const tslib_1 = require("tslib");
const tsyringe_1 = require("tsyringe");
const AppContainer_1 = require("../AppContainer");
const Common_1 = require("../Common");
const Routing_1 = require("../Routing");
const AuthenticationProvider_1 = require("./AuthenticationProvider");
const JwtAuthenticationProvider_1 = require("./JwtAuthentication/JwtAuthenticationProvider");
const BaseUserProvider_1 = require("./UserProvider/BaseUserProvider");
const UserProvider_1 = require("./UserProvider/UserProvider");
let Authentication = class Authentication {
    constructor(config) {
        this._provider = null;
        this._userProvider = null;
        const userProvider = config.get('auth.userProvider', BaseUserProvider_1.BaseUserProvider);
        if (userProvider) {
            const userInstance = new userProvider();
            if (!(userInstance instanceof UserProvider_1.UserProvider)) {
                throw new Error('Authentication: user provider must be an instance of UserProvider.');
            }
            this._userProvider = userInstance;
        }
        let provider = config.get('auth.authenticationProvider', JwtAuthenticationProvider_1.JwtAuthenticationProvider);
        if (provider) {
            const providerInstance = new provider(this._userProvider);
            if (!(providerInstance instanceof AuthenticationProvider_1.AuthenticationProvider)) {
                throw new Error('Authentication: authentication provider must be an instance of AuthenticationProvider.');
            }
            this._provider = providerInstance;
        }
        if (!this._userProvider || !this._provider) {
            Common_1.Log.warn('User provider or auth provider could not be instantiated, double check your config in Config/Auth.js');
        }
    }
    checkContextIsBound() {
        if (!Routing_1.RequestContext.get())
            throw new Error('Context hasnt been bound');
    }
    /**
     * Is the user authenticated?
     */
    check() {
        this.checkContextIsBound();
        return !!Routing_1.RequestContext.get().user;
    }
    /**
     * Login with the provided credentials
     */
    attempt(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this._provider.verifyLoginCredentials(credentials);
            if (!user) {
                return false;
            }
            this.authoriseAs(user);
            return true;
        });
    }
    /**
     * Authorise this request as the provided user
     *
     * @param user
     */
    authoriseAs(user) {
        this.checkContextIsBound();
        Routing_1.RequestContext.get().setUser(user);
    }
    /**
     * Get the authenticated user
     */
    user() {
        this.checkContextIsBound();
        if (!this.check())
            return null;
        return Routing_1.RequestContext.get().user;
    }
    getAuthProvider() {
        return this._provider;
    }
    getUserProvider() {
        return this._userProvider;
    }
};
Authentication = tslib_1.__decorate([
    tsyringe_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [AppContainer_1.ConfigRepository])
], Authentication);
exports.Authentication = Authentication;
//# sourceMappingURL=Authentication.js.map