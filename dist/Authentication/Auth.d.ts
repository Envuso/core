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
    static check(): boolean;
    static attempt(credentials: AuthCredentialContract): Promise<boolean>;
    static authoriseAs<T>(user: Authenticatable<T>): void;
    static user<T>(): T;
    static getAuthProvider<T extends AuthenticationProvider>(providerType: new (userProvider: UserProvider) => AuthenticationProvider): T;
    static getUserProvider(): UserProvider;
}
