import {resolve} from "../AppContainer";
import {AuthenticationProviderContract} from "../Contracts/Authentication/AuthenticationProviderContract";
import {AuthCredentialContract} from "../Contracts/Authentication/UserProvider/AuthCredentials";
import {AuthenticatableContract} from "../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {UserProviderContract} from "../Contracts/Authentication/UserProvider/UserProviderContract";
import {Authentication} from "./Authentication";
import {AuthenticationProvider} from "./AuthenticationProvider";

/**
 * This class is kind of like a proxy for accessing Authentication without
 * using injection in your controllers/classes. It will just allow
 * for some easy access to the authentication logic/handling.
 */
export class Auth {

	/**
	 * Check if the user is authenticated
	 *
	 * @returns {boolean}
	 */
	public static check() {
		return resolve(Authentication).check();
	}

	/**
	 * Attempt to login with the credentials of x user
	 *
	 * @param {AuthCredentialContract} credentials
	 * @returns {Promise<boolean>}
	 */
	public static async attempt(credentials: AuthCredentialContract) {
		return resolve(Authentication).attempt(credentials);
	}

	/**
	 * Authenticate as x user
	 *
	 * @param {AuthenticatableContract<T>} user
	 */
	public static authoriseAs<T>(user: AuthenticatableContract<T>) {
		return resolve(Authentication).authoriseAs(user);
	}

	/**
	 * Get the authenticated user
	 *
	 * @returns {T}
	 */
	public static user<T>(): T {
		return resolve(Authentication).user<T>().getUser();
	}

	/**
	 * Get the id of the authenticated user
	 *
	 * @returns {string|null}
	 */
	public static id(): string | null {
		const user = resolve(Authentication).user().getUser() as any;

		return user?._id.toHexString() ?? null;
	}

	public static getAuthProvider<T extends AuthenticationProvider>(
		providerType: new (userProvider: UserProviderContract) => AuthenticationProviderContract
	): T {
		return resolve(Authentication).getAuthProvider(providerType) as T;
	}

	public static getUserProvider(): UserProviderContract {
		return resolve(Authentication).getUserProvider();
	}

}
