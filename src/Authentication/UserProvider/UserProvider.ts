import {Authenticatable} from "../../Common";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Config/Auth";

export abstract class UserProvider {

	abstract getUser<T>(id: string): Promise<Authenticatable<T>>;

	abstract userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<Authenticatable<T>>

	abstract verifyLoginCredentials<T>(credentials: AuthCredentialContract) : Promise<Authenticatable<T>>;
}
