import type {AuthCredentialContract, AuthenticationIdentifier} from "./AuthCredentials";
import type {AuthenticatableContract} from "./AuthenticatableContract";

export interface UserProviderContract {
	getUser<T>(id: string): Promise<AuthenticatableContract<T>>;

	userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<AuthenticatableContract<T>>;

	verifyLoginCredentials<T>(credentials: AuthCredentialContract): Promise<AuthenticatableContract<T>>;
}
