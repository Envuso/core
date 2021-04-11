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
const app_1 = require("@envuso/app");
const dist_1 = require("@envuso/common/dist");
const dist_2 = require("@envuso/routing/dist");
const Authentication_1 = require("../src/Authentication");
const JwtAuthenticationProvider_1 = require("../src/JwtAuthentication/JwtAuthenticationProvider");
const BaseUserProvider_1 = require("../src/UserProvider/BaseUserProvider");
const UserProvider_1 = require("../src/UserProvider/UserProvider");
const bootApp = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield app_1.App.bootInstance();
        yield app.loadServiceProviders();
    });
};
const unloadApp = function () {
    return __awaiter(this, void 0, void 0, function* () {
        app_1.App.getInstance().container().reset();
        yield app_1.App.getInstance().unload();
    });
};
beforeEach(() => {
    return bootApp();
});
afterEach(() => {
    return unloadApp();
});
describe('authentication package', () => {
    test('can create authentication', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const auth = app.resolve(Authentication_1.Authentication);
        expect(auth.getUserProvider()).toBeDefined();
        expect(auth.getAuthProvider()).toBeDefined();
    }));
});
describe('jwt authentication', () => {
    test('it throws error with invalid authentication provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        app.resolve(app_1.ConfigRepository).set('auth.authenticationProvider', UserProvider_1.UserProvider);
        expect(() => {
            app.resolve(Authentication_1.Authentication);
        }).toThrow();
    }));
    test('it throws error with invalid user provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        app.resolve(app_1.ConfigRepository).set('auth.userProvider', JwtAuthenticationProvider_1.JwtAuthenticationProvider);
        expect(() => {
            app.resolve(Authentication_1.Authentication);
        }).toThrow();
    }));
    test('can bind jwt authentication adapter', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        app.resolve(app_1.ConfigRepository).set('auth.authenticationProvider', JwtAuthenticationProvider_1.JwtAuthenticationProvider);
        app.resolve(app_1.ConfigRepository).set('auth.userProvider', BaseUserProvider_1.BaseUserProvider);
        const auth = app.resolve(Authentication_1.Authentication);
        expect(auth.getAuthProvider()).toBeInstanceOf(JwtAuthenticationProvider_1.JwtAuthenticationProvider);
    }));
    test('can obtain jwt from header', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const auth = app.resolve(Authentication_1.Authentication);
        const req = new dist_2.Request({
            headers: {
                'authorization': 'Bearer 12345'
            }
        });
        const tokenRes = auth.getAuthProvider().getAuthenticationCredential(req);
        expect(tokenRes).toEqual('12345');
    }));
    test('can generate jwt', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const auth = app.resolve(Authentication_1.Authentication);
        const token = auth.getAuthProvider().issueToken('1234');
        expect(token).toBeDefined();
    }));
    test('can verify jwt', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const auth = app.resolve(Authentication_1.Authentication);
        const authProvider = auth.getAuthProvider();
        const token = authProvider.issueToken('1234');
        const verified = authProvider.verifyAuthenticationCredential(token);
        expect(verified).toBeDefined();
        expect(verified.id).toEqual('1234');
    }));
    test('can authenticate', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = app_1.App.getInstance();
        const auth = app.resolve(Authentication_1.Authentication);
        dist_2.RequestContext.bind(() => __awaiter(void 0, void 0, void 0, function* () {
            const authProvider = auth.getAuthProvider();
            const jwt = authProvider.issueToken('12345');
            const req = new dist_2.Request({
                headers: {
                    'authorization': 'Bearer ' + jwt
                }
            });
            const authed = yield authProvider.authoriseRequest(req);
            expect(authed).toBeInstanceOf(dist_1.Authenticatable);
            auth.authoriseAs(authed);
            expect(auth.check()).toBeTruthy();
            expect(auth.user()).toBeInstanceOf(dist_1.Authenticatable);
        }));
    }));
});
//# sourceMappingURL=authentication.spec.js.map