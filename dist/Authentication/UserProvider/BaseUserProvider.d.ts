import { Authenticatable } from "../../Common";
import { AuthCredentialContract, AuthenticationIdentifier } from "../../Config/Auth";
import { UserProvider } from "./UserProvider";
export declare class BaseUserProvider extends UserProvider {
    getUser<T>(id: string): Promise<Authenticatable<T>>;
    userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<Authenticatable<T>>;
    verifyLoginCredentials<T>(credentials: AuthCredentialContract): Promise<Authenticatable<T>>;
}
