import {Authenticatable} from "../../Common";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Config/Auth";
import {UserProvider} from "./UserProvider";

export class BaseUserProvider extends UserProvider {

	async getUser(id: string): Promise<Authenticatable> {
		return new Authenticatable().setUser({id});
	}

	async userForIdentifier(identifier: AuthenticationIdentifier): Promise<Authenticatable> {
		return new Authenticatable().setUser(identifier);
	}

	public async verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable> {
		return new Authenticatable().setUser(credentials);
	}


}
