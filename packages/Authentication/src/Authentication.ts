import {ConfigRepository, resolve} from "@envuso/app";
import {Authenticatable, Log} from "@envuso/common/dist";
import {RequestContext} from "@envuso/routing/dist";
import Auth, {AuthCredentialContract} from "../Config/Auth";
import {AuthenticationProvider} from "./AuthenticationProvider";
import {JwtAuthenticationProvider} from "./JwtAuthentication/JwtAuthenticationProvider";
import {BaseUserProvider} from "./UserProvider/BaseUserProvider";
import {UserProvider} from "./UserProvider/UserProvider";

export class Authentication {

	private _provider: AuthenticationProvider = null;
	private _userProvider: UserProvider       = null;

	constructor(config: ConfigRepository) {

		const userProvider = config.get<new () => UserProvider>(
			'auth.userProvider', BaseUserProvider
		);

		if (userProvider) {
			const userInstance = new userProvider();

			if (!(userInstance instanceof UserProvider)) {
				throw new Error('Authentication: user provider must be an instance of UserProvider.');
			}
			this._userProvider = userInstance;
		}

		let provider = config.get<new (userProvider: UserProvider) => AuthenticationProvider>(
			'auth.authenticationProvider', JwtAuthenticationProvider
		);

		if (provider) {
			const providerInstance = new provider(this._userProvider);

			if (!(providerInstance instanceof AuthenticationProvider)) {
				throw new Error('Authentication: authentication provider must be an instance of AuthenticationProvider.');
			}

			this._provider = providerInstance;
		}

		if (!this._userProvider || !this._provider) {
			Log.warn('User provider or auth provider could not be instantiated, double check your config in Config/Auth.js')
		}

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
		const user: Authenticatable = await this._provider.verifyLoginCredentials(credentials);

		if (!user) {
			return false;
		}

		this.authoriseAs(<typeof Authenticatable>user);

		return true;
	}

	/**
	 * Authorise this request as the provided user
	 *
	 * @param user
	 */
	public authoriseAs(user: typeof Authenticatable) {
		this.checkContextIsBound();

		RequestContext.get().setUser(user);
	}

	/**
	 * Get the authenticated user
	 */
	user(): Authenticatable | null {
		this.checkContextIsBound();

		if (!this.check())
			return null;

		return RequestContext.get().user;
	}

	getAuthProvider<T extends AuthenticationProvider>(): T {
		return <T>this._provider;
	}

	getUserProvider(): UserProvider {
		return this._userProvider;
	}

}
