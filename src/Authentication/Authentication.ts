import {injectable} from "tsyringe";
import {ConfigRepository} from "../AppContainer";
import {Authenticatable, Log} from "../Common";
import {AuthCredentialContract} from "../Config/Auth";
import {RequestContext} from "../Routing";
import {AuthenticationProvider} from "./AuthenticationProvider";
import {JwtAuthenticationProvider} from "./AuthenticationProviders/JwtAuthenticationProvider";
import {BaseUserProvider} from "./UserProvider/BaseUserProvider";
import {UserProvider} from "./UserProvider/UserProvider";

type AuthenticationProviderParameter = new (userProvider: UserProvider) => AuthenticationProvider;

@injectable()
export class Authentication {

	private _providers: Map<string, AuthenticationProvider> = new Map();

	private _userProvider: UserProvider = null;

	constructor(config: ConfigRepository) {

		this.setUserProvider(config);
		this.setAuthenticationProviders(config);

		if (!this._userProvider || !this._providers.size) {
			Log.warn('User provider or auth provider could not be instantiated, double check your config in Config/Auth.js');
		}

	}

	private setAuthenticationProviders(config: ConfigRepository) {

		let providers = config.get<AuthenticationProviderParameter[]>(
			'auth.authenticationProviders', [JwtAuthenticationProvider]
		);

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

	private setUserProvider(config: ConfigRepository) {
		const userProvider = config.get<new () => UserProvider>(
			'auth.userProvider', BaseUserProvider
		);

		if (!userProvider) {
			throw new Error('Authentication: No user provider specified in configuration.');
		}

		const userInstance = new userProvider();

		if (!(userInstance instanceof UserProvider)) {
			throw new Error('Authentication: user provider must be an instance of UserProvider.');
		}

		this._userProvider = userInstance;
	}

	private checkContextIsBound() {
		if (!RequestContext.get())
			throw new Error('Context hasnt been bound');
	}

	/**
	 * Is the user authenticated?
	 */
	check() {
		this.checkContextIsBound();

		return !!RequestContext.get().user;
	}

	/**
	 * Login with the provided credentials
	 */
	async attempt(credentials: AuthCredentialContract) {
		const user: Authenticatable<any> = await this._userProvider.verifyLoginCredentials(credentials);

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
	public authoriseAs(user: Authenticatable<any>) {
		this.checkContextIsBound();

		RequestContext.get().setUser(user);
	}

	/**
	 * Get the authenticated user
	 */
	user<T>(): Authenticatable<T> | null {
		this.checkContextIsBound();

		if (!this.check())
			return null;

		return RequestContext.get().user;
	}

	getAuthProvider<T extends AuthenticationProvider>(providerType: AuthenticationProviderParameter): T {
		if (!this.isUsingProvider(providerType)) {
			throw new Error('Trying to use auth provider ' + providerType.name + ' but its not set in the configuration.');
		}

		return this._providers.get(providerType.name) as T;
	}

	isUsingProvider(providerType: AuthenticationProviderParameter) {
		return this._providers.has(providerType.name);
	}

	getUserProvider(): UserProvider {
		return this._userProvider;
	}

}
