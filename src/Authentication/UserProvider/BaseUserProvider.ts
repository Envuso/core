import type {AuthCredentialContract, AuthenticationIdentifier} from "../../Contracts/Authentication/UserProvider/AuthCredentials";
import type {AuthenticatableContract} from "../../Contracts/Authentication/UserProvider/AuthenticatableContract";
import type {UserProviderContract} from "../../Contracts/Authentication/UserProvider/UserProviderContract";
import {UserProvider} from "./UserProvider";

/**
 * Placeholder used when no `Auth.userProvider` is configured.
 *
 * It used to "find" a user for any id and accept any credentials, so an app without
 * a configured provider authenticated everyone. Now every lookup fails loudly.
 * Configure a real provider, e.g. `userProvider = ModelUserProvider` in AuthConfiguration.
 */
export class BaseUserProvider extends UserProvider implements UserProviderContract {

	private notConfigured(): never {
		throw new Error(
			'Authentication: no user provider is configured. Set `userProvider` in your AuthConfiguration ' +
			'(e.g. ModelUserProvider) or extend UserProvider.'
		);
	}

	public async getUser<T>(id: string): Promise<AuthenticatableContract<T>> {
		return this.notConfigured();
	}

	public async userForIdentifier<T>(identifier: AuthenticationIdentifier): Promise<AuthenticatableContract<T>> {
		return this.notConfigured();
	}

	public async verifyLoginCredentials<T>(credentials: AuthCredentialContract): Promise<AuthenticatableContract<T>> {
		return this.notConfigured();
	}

}
