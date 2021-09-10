import {injectable} from "tsyringe";
import {ConfigRepository} from "../AppContainer";
import {Log} from "../Common";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {AuthenticationContract} from "../Contracts/Authentication/AuthenticationContract";
import {AuthenticationProviderContract} from "../Contracts/Authentication/AuthenticationProviderContract";
import {AuthCredentialContract} from "../Contracts/Authentication/UserProvider/AuthCredentials";
import {AuthenticatableContract} from "../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {UserProviderContract} from "../Contracts/Authentication/UserProvider/UserProviderContract";
import {RequestContext} from "../Routing/Context/RequestContext";
import {AuthenticationProvider} from "./AuthenticationProvider";
import {JwtAuthenticationProvider} from "./AuthenticationProviders/JwtAuthenticationProvider";
import {BaseUserProvider} from "./UserProvider/BaseUserProvider";
import {UserProvider} from "./UserProvider/UserProvider";

export type AuthenticationProviderParameter = new (userProvider: UserProviderContract) => AuthenticationProviderContract;

@injectable()
export class Authentication implements AuthenticationContract {

	public _providers: Map<string, AuthenticationProvider> = new Map();

	public _userProvider: UserProvider = null;

	constructor(config: ConfigRepository) {

		this.setUserProvider(config);
		this.setAuthenticationProviders(config);

		if (!this._userProvider || !this._providers.size) {
			Log.warn('User provider or auth provider could not be instantiated, double check your config in Config/Auth.js');
		}

	}

	public setAuthenticationProviders(config: ConfigRepositoryContract) {

		let providers = config.get<string, any>('Auth.authenticationProviders', [JwtAuthenticationProvider]);

		if (!providers || !providers?.length) {
			throw new Error('No authentication providers are configured.');
		}

		for (let provider of providers) {
			const providerInstance = new provider(this._userProvider);

			if (!(providerInstance instanceof AuthenticationProvider)) {
				throw new Error('Authentication: authentication provider must be an instance of AuthenticationProvider.');
			}

			this._providers.set(provider.name, providerInstance);
		}
	}

	public setUserProvider(config: ConfigRepositoryContract) {
		const userProvider = config.get<string, any>('Auth.userProvider', BaseUserProvider);

		if (!userProvider) {
			throw new Error('Authentication: No user provider specified in configuration.');
		}

		const userInstance = new userProvider();

		if (!(userInstance instanceof UserProvider)) {
			throw new Error('Authentication: user provider must be an instance of UserProvider.');
		}

		this._userProvider = userInstance;
	}

	public checkContextIsBound() {
		if (!RequestContext.get())
			throw new Error('Context hasnt been bound');
	}

	/**
	 * Is the user authenticated?
	 */
	public check() {
		this.checkContextIsBound();

		return !!RequestContext.get().user;
	}

	/**
	 * Login with the provided credentials
	 */
	public async attempt(credentials: AuthCredentialContract) {
		const user: AuthenticatableContract<any> = await this._userProvider.verifyLoginCredentials(credentials);

		if (!user) {
			return false;
		}

		this.authoriseAs(user);

		return true;
	}

	/**
	 * Authorise this request as the provided user
	 *
	 * @param user
	 */
	public authoriseAs(user: AuthenticatableContract<any>) {
		this.checkContextIsBound();

		RequestContext.get().setUser(user);
	}

	/**
	 * Get the authenticated user
	 */
	public user<T>(): AuthenticatableContract<T> | null {
		this.checkContextIsBound();

		if (!this.check())
			return null;

		return RequestContext.get().user;
	}

	public getAuthProvider<T extends AuthenticationProvider>(providerType: AuthenticationProviderParameter | string): T {
		const prov = typeof providerType === 'string' ? providerType : providerType.name;

		if (!this.isUsingProvider(providerType)) {
			throw new Error('Trying to use auth provider ' + prov + ' but its not set in the configuration.');
		}

		return this._providers.get(prov) as T;
	}

	public isUsingProvider(providerType: AuthenticationProviderParameter | string) {
		return this._providers.has(
			typeof providerType === 'string' ? providerType : providerType.name
		);
	}

	public getUserProvider(): UserProviderContract {
		return this._userProvider;
	}

}
