import { ConfigRepository } from "../AppContainer";
import { Authenticatable } from "../Common";
import { AuthCredentialContract } from "../Config/Auth";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { UserProvider } from "./UserProvider/UserProvider";
export declare class Authentication {
    private _provider;
    private _userProvider;
    constructor(config: ConfigRepository);
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
    authoriseAs(user: typeof Authenticatable): void;
    /**
     * Get the authenticated user
     */
    user(): Authenticatable | null;
    getAuthProvider<T extends AuthenticationProvider>(): T;
    getUserProvider(): UserProvider;
}
