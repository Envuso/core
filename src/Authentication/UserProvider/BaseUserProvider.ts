import {resolve} from "../../AppContainer";
import {AuthCredentialContract, AuthenticationIdentifier} from "../../Contracts/Authentication/UserProvider/AuthCredentials";
import {AuthenticatableContract} from "../../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {UserProviderContract} from "../../Contracts/Authentication/UserProvider/UserProviderContract";
import {UserProvider} from "./UserProvider";

export class BaseUserProvider extends UserProvider implements UserProviderContract {

	private getInstance<T>(): AuthenticatableContract<T> {
		return resolve<AuthenticatableContract<T>>('Authenticatable');
	}

	public async getUser<T>(id: string): Promise<AuthenticatableContract<T>> {
		return this.getInstance<T>().setUser({id});
	}

	public async userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<AuthenticatableContract<T>> {
		return this.getInstance<T>().setUser(identifier);
	}

	public async verifyLoginCredentials<T>(credentials: AuthCredentialContract): Promise<AuthenticatableContract<T>> {
		return this.getInstance<T>().setUser(credentials);
	}


}
