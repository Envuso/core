import {AuthenticationProvider, AuthenticationProviderParameter} from "../../Authentication";
import {ConfigRepositoryContract} from "../AppContainer/Config/ConfigRepositoryContract";
import {AuthenticationProviderContract} from "./AuthenticationProviderContract";
import {AuthCredentialContract} from "./UserProvider/AuthCredentials";
import {AuthenticatableContract} from "./UserProvider/AuthenticatableContract";
import {UserProviderContract} from "./UserProvider/UserProviderContract";

export interface AuthenticationContract {
	_providers: Map<string, AuthenticationProviderContract>;
	_userProvider: UserProviderContract;

	setAuthenticationProviders(config: ConfigRepositoryContract): void;

	setUserProvider(config: ConfigRepositoryContract): void;

	checkContextIsBound(): void;

	/**
	 * Is the user authenticated?
	 */
	check(): boolean;

	/**
	 * Login with the provided credentials
	 */
	attempt(credentials: AuthCredentialContract): Promise<boolean>;

	/**
	 * Authorise this request as the provided user
	 *
	 * @param user
	 */
	authoriseAs(user: AuthenticatableContract<any>): void;

	/**
	 * Get the authenticated user
	 */
	user<T>(): AuthenticatableContract<T> | null;

	getAuthProvider<T extends AuthenticationProvider>(providerType: AuthenticationProviderParameter | string): T;

	isUsingProvider(providerType: AuthenticationProviderParameter | string): any;

	getUserProvider(): UserProviderContract;
}
