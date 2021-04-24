import {Authenticatable} from "../../Common";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Config/Auth";

export abstract class UserProvider {

	abstract getUser(id: string): Promise<Authenticatable>

	abstract userForIdentifier(identifier: AuthenticationIdentifier): Promise<Authenticatable>

	abstract verifyLoginCredentials(credentials: AuthCredentialContract) : Promise<Authenticatable>;
}
