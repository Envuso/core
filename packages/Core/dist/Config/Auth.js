"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("@envuso/authentication");
const User_1 = require("../src/App/Models/User");
const ModelUserProvider_1 = require("../src/Authentication/ModelUserProvider");
exports.default = {
    /**
     * The model that will be used for all auth logic/ModelUserProvider
     */
    userModel: User_1.User,
    /**
     * This will allow you to swap out authentication handling
     * and build your own custom providers for different things
     */
    authenticationProvider: authentication_1.JwtAuthenticationProvider,
    /**
     * This will allow you to change how the user is acquired
     * For example, you could write a provider to get user
     * information from an api endpoint, database etc
     */
    userProvider: ModelUserProvider_1.ModelUserProvider,
    /**
     * This will allow users authentication to use email for primary login.
     * For example, you could change this to "username" instead if
     * you didn't want to use email registration and login.
     */
    primaryIdentifier: 'email',
    jwt: {
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
    }
};
//# sourceMappingURL=Auth.js.map