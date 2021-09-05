import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JwtAuthenticationProvider, SessionAuthenticationProvider, ModelUserProvider } from "../../Authentication";

export interface AuthConfigurationInterface {
    userModel: string;
    /**
     * This will allow you to swap out authentication handling
     * and build your own custom providers for different things
     */
    authenticationProviders: (typeof JwtAuthenticationProvider | typeof SessionAuthenticationProvider)[];
    /**
     * This will allow you to change how the user is acquired
     * For example, you could write a provider to get user
     * information from an api endpoint, database etc
     */
    userProvider: typeof ModelUserProvider;
    /**
     * This will allow users authentication to use email for primary login.
     * For example, you could change this to "username" instead if
     * you didn't want to use email registration and login.
     */
    primaryIdentifier: string | number | symbol;
    jwt: { authorizationHeaderPrefix: string; jwtSigningOptions: SignOptions; jwtVerifyOptions: VerifyOptions; };
}
