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
exports.Authentication = void 0;
const dist_1 = require("@envuso/common/dist");
const dist_2 = require("@envuso/routing/dist");
const AuthenticationProvider_1 = require("./AuthenticationProvider");
const JwtAuthenticationProvider_1 = require("./JwtAuthentication/JwtAuthenticationProvider");
const BaseUserProvider_1 = require("./UserProvider/BaseUserProvider");
const UserProvider_1 = require("./UserProvider/UserProvider");
class Authentication {
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
            dist_1.Log.warn('User provider or auth provider could not be instantiated, double check your config in Config/Auth.js');
        }
    }
    checkContextIsBound() {
        if (!dist_2.RequestContext.get())
            throw new Error('Context hasnt been bound');
    }
    /**
     * Is the user authenticated?
     */
    check() {
        this.checkContextIsBound();
        return !!dist_2.RequestContext.get().user;
    }
    /**
     * Login with the provided credentials
     */
    attempt(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
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
        dist_2.RequestContext.get().setUser(user);
    }
    /**
     * Get the authenticated user
     */
    user() {
        this.checkContextIsBound();
        if (!this.check())
            return null;
        return dist_2.RequestContext.get().user;
    }
    getAuthProvider() {
        return this._provider;
    }
    getUserProvider() {
        return this._userProvider;
    }
}
exports.Authentication = Authentication;
//# sourceMappingURL=Authentication.js.map