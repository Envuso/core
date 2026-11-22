import type {AuthCredentialContract, AuthenticationIdentifier} from "../../Contracts/Authentication/UserProvider/AuthCredentials";
import type {AuthenticatableContract} from "../../Contracts/Authentication/UserProvider/AuthenticatableContract";
import type {UserProviderContract} from "../../Contracts/Authentication/UserProvider/UserProviderContract";

export abstract class UserProvider implements UserProviderContract {
	public abstract getUser<T>(id: string): Promise<AuthenticatableContract<T>>;

	public abstract userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<AuthenticatableContract<T>>

	public abstract verifyLoginCredentials<T>(credentials: AuthCredentialContract): Promise<AuthenticatableContract<T>>;
}
