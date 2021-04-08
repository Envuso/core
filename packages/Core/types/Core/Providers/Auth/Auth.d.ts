import { AuthCredentialContract } from "@App/Contracts/AuthContracts";
import { User } from "@App/Models/User";
import { AuthorisedUser } from "./AuthorisedUser";
export declare class Auth {
    constructor();
    /**
     * Attempt to login with the credentials
     *
     * @param credentials
     */
    static attempt(credentials: AuthCredentialContract): Promise<boolean>;
    /**
     * Force login to x user
     *
     * @param user
     */
    static loginAs(user: User): void;
    /**
     * Check the credentials to see if the user can register with them
     * Basically, if x email/username is in use.
     * @param credentials
     */
    static canRegisterAs(credentials: AuthCredentialContract): Promise<boolean>;
    /**
     * Check if there is an authed user
     */
    static check(): boolean;
    /**
     * Get the currently authed user(if any) from the current Http Context
     */
    static user(): AuthorisedUser;
}
