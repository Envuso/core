"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthenticationProvider = void 0;
const tslib_1 = require("tslib");
const AppContainer_1 = require("../../AppContainer");
const Common_1 = require("../../Common");
const AuthenticationProvider_1 = require("../AuthenticationProvider");
const jsonwebtoken_1 = require("jsonwebtoken");
class JwtAuthenticationProvider extends AuthenticationProvider_1.AuthenticationProvider {
    constructor(userProvider) {
        var _a;
        super();
        this._userProvider = userProvider;
        this._appKey = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('app.appKey', null);
        if (!this._appKey) {
            Common_1.Log.warn('You are trying to use JWT Auth. But there is no app key defined in config(Config/App.ts), which is needed to sign Json Web Tokens.');
            return;
        }
        this._config = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('app.auth', {
            /**
             * The prefix used in authorization header checks
             */
            authorizationHeaderPrefix: 'Bearer',
            /**
             * Used to sign JWT
             */
            jwtSigningOptions: {
                expiresIn: "24h",
                algorithm: "HS256",
            },
            /**
             * Used to verify JWT are valid
             */
            jwtVerifyOptions: {
                ignoreExpiration: false,
                algorithms: ["HS256"],
            }
        });
        if (!((_a = this._config) === null || _a === void 0 ? void 0 : _a.authorizationHeaderPrefix)) {
            this._config.authorizationHeaderPrefix = 'Bearer';
        }
    }
    getAuthenticationCredential(request) {
        const authHeader = request.header('authorization');
        if (!authHeader) {
            return null;
        }
        const tokenParts = authHeader.split(" ");
        if (tokenParts.length !== 2) {
            return null;
        }
        const type = tokenParts[0];
        const token = tokenParts[1];
        if (!token || !type) {
            return null;
        }
        if (type && token && type === this._config.authorizationHeaderPrefix) {
            return token;
        }
        return null;
    }
    verifyAuthenticationCredential(credential) {
        if (!credential) {
            return null;
        }
        return jsonwebtoken_1.verify(credential, this._appKey, this._config.jwtVerifyOptions);
    }
    authoriseRequest(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const token = this.getAuthenticationCredential(request);
            if (!token) {
                return null;
            }
            const verifiedToken = this.verifyAuthenticationCredential(token);
            if (!verifiedToken) {
                return null;
            }
            const userId = verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.id;
            if (!userId) {
                return null;
            }
            const user = yield this._userProvider.getUser(userId);
            if (!user) {
                return null;
            }
            return new Common_1.Authenticatable(user);
        });
    }
    verifyLoginCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const primaryIdentifier = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('auth.primaryIdentifier');
            const user = yield this._userProvider.userForIdentifier(credentials[primaryIdentifier]);
            if (!user) {
                return null;
            }
            // Ts ignore until we find a nicer solution for shared structure
            //@ts-ignore
            const password = user.password;
            if (!Common_1.Hash.check(credentials.password, password)) {
                return null;
            }
            return user;
        });
    }
    issueToken(id) {
        return jsonwebtoken_1.sign({ id }, this._appKey, this._config.jwtSigningOptions);
    }
}
exports.JwtAuthenticationProvider = JwtAuthenticationProvider;
//# sourceMappingURL=JwtAuthenticationProvider.js.map