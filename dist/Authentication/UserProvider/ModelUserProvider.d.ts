import { Authenticatable } from "../../Common";
import { AuthCredentialContract, AuthenticationIdentifier } from "../../Config/Auth";
import { UserProvider } from "./UserProvider";
export declare class ModelUserProvider extends UserProvider {
    /**
     * Get a user by id from mongodb
     * Uses the model provided in Auth.ts config file(userModel)
     *
     * @param id
     */
    getUser(id: string): Promise<Authenticatable>;
    /**
     * Get a user by it's primary auth identifier(for example, email)
     * Uses the model provided in Auth.ts config file(userModel)
     *
     * @param identifier
     */
    userForIdentifier(identifier: AuthenticationIdentifier): Promise<Authenticatable>;
    verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>;
}
