import {Authenticatable} from "../../Common";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Config/Auth";
import {UserProvider} from "./UserProvider";

export class BaseUserProvider extends UserProvider {

	async getUser<T>(id: string): Promise<Authenticatable<T>> {
		return new Authenticatable().setUser({id}) as Authenticatable<T>;
	}

	async userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<Authenticatable<T>> {
		return new Authenticatable().setUser(identifier) as Authenticatable<T>;
	}

	public async verifyLoginCredentials<T>(credentials: AuthCredentialContract): Promise<Authenticatable<T>> {
		return new Authenticatable().setUser(credentials) as Authenticatable<T>;
	}


}
