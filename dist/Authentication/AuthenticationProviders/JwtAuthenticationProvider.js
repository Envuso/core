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
exports.JwtAuthenticationProvider = void 0;
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
    getAuthenticationInformation(request) {
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
    validateAuthenticationInformation(credential) {
        if (!credential) {
            return null;
        }
        return jsonwebtoken_1.verify(credential, this._appKey, this._config.jwtVerifyOptions);
    }
    authoriseRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.getAuthenticationInformation(request);
            if (!token) {
                return null;
            }
            const verifiedToken = this.validateAuthenticationInformation(token);
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
            return new Common_1.Authenticatable().setUser(user);
        });
    }
    issueToken(id) {
        return jsonwebtoken_1.sign({ id }, this._appKey, this._config.jwtSigningOptions);
    }
}
exports.JwtAuthenticationProvider = JwtAuthenticationProvider;
//# sourceMappingURL=JwtAuthenticationProvider.js.map