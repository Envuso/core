import { ConfigRepository } from "../AppContainer";
import { Authenticatable } from "../Common";
import { AuthCredentialContract } from "../Config/Auth";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { UserProvider } from "./UserProvider/UserProvider";
declare type AuthenticationProviderParameter = new (userProvider: UserProvider) => AuthenticationProvider;
export declare class Authentication {
    private _providers;
    private _userProvider;
    constructor(config: ConfigRepository);
    private setAuthenticationProviders;
    private setUserProvider;
    private checkContextIsBound;
    /**
     * Is the user authenticated?
     */
    check(): boolean;
    /**
     * Login with the provided credentials
     */
    attempt(credentials: AuthCredentialContract): Promise<boolean>;
    /**
     * Authorise this request as the provided user
     *
     * @param user
     */
    authoriseAs(user: Authenticatable): void;
    /**
     * Get the authenticated user
     */
    user(): Authenticatable | null;
    getAuthProvider<T extends AuthenticationProvider>(providerType: AuthenticationProviderParameter): T;
    isUsingProvider(providerType: AuthenticationProviderParameter): boolean;
    getUserProvider(): UserProvider;
}
export {};
