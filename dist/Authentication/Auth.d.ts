import { Authenticatable } from "../Common";
import { AuthCredentialContract } from "../Config/Auth";
import { AuthenticationProvider } from "./AuthenticationProvider";
import { UserProvider } from "./UserProvider/UserProvider";
/**
 * This class is kind of like a proxy for accessing Authentication without
 * using injection in your controllers/classes. It will just allow
 * for some easy access to the authentication logic/handling.
 */
export declare class Auth {
    /**
     * Check if the user is authenticated
     *
     * @returns {boolean}
     */
    static check(): boolean;
    /**
     * Attempt to login with the credentials of x user
     *
     * @param {AuthCredentialContract} credentials
     * @returns {Promise<boolean>}
     */
    static attempt(credentials: AuthCredentialContract): Promise<boolean>;
    /**
     * Authenticate as x user
     *
     * @param {Authenticatable<T>} user
     */
    static authoriseAs<T>(user: Authenticatable<T>): void;
    /**
     * Get the authenticated user
     *
     * @returns {T}
     */
    static user<T>(): T;
    /**
     * Get the id of the authenticated user
     *
     * @returns {string|null}
     */
    static id(): string | null;
    static getAuthProvider<T extends AuthenticationProvider>(providerType: new (userProvider: UserProvider) => AuthenticationProvider): T;
    static getUserProvider(): UserProvider;
}
