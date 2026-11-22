import {AuthenticationProvider, type AuthenticationProviderParameter} from "../../Authentication";
import type {ConfigRepositoryContract} from "../AppContainer/Config/ConfigRepositoryContract";
import type {AuthenticationProviderContract} from "./AuthenticationProviderContract";
import type {AuthCredentialContract} from "./UserProvider/AuthCredentials";
import type {AuthenticatableContract} from "./UserProvider/AuthenticatableContract";
import type {UserProviderContract} from "./UserProvider/UserProviderContract";

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
