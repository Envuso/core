import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JwtAuthenticationProvider } from "../src/JwtAuthentication/JwtAuthenticationProvider";
import { BaseUserProvider } from "../src/UserProvider/BaseUserProvider";
export declare type AuthenticationIdentifier = keyof AuthCredentialContract;
export interface AuthCredentialContract {
    email: string;
    password: string;
}
declare const _default: {
    /**
     * This will allow you to swap out authentication handling
     * and build your own custom providers for different things
     */
    authenticationProvider: typeof JwtAuthenticationProvider;
    /**
     * This will allow you to change how the user is acquired
     * For example, you could write a provider to get user
     * information from an api endpoint, database etc
     */
    userProvider: typeof BaseUserProvider;
    /**
     * This will allow users authentication to use email for primary login.
     * For example, you could change this to "username" instead if
     * you didn't want to use email registration and login.
     */
    primaryIdentifier: keyof AuthCredentialContract;
    jwt: {
        /**
         * The prefix used in authorization header checks
         */
        authorizationHeaderPrefix: string;
        /**
         * Used to sign JWT
         */
        jwtSigningOptions: SignOptions;
        /**
         * Used to verify JWT are valid
         */
        jwtVerifyOptions: VerifyOptions;
    };
};
export default _default;
