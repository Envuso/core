import { Authenticatable } from "../../Common";
import { AuthCredentialContract, AuthenticationIdentifier } from "../../Config/Auth";
import { UserProvider } from "./UserProvider";
export declare class BaseUserProvider extends UserProvider {
    getUser(id: string): Promise<Authenticatable>;
    userForIdentifier(identifier: AuthenticationIdentifier): Promise<Authenticatable>;
    verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>;
}
