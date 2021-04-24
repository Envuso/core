import {resolve} from "../AppContainer";
import {Authenticatable} from "../Common";
import {AuthCredentialContract} from "../Config/Auth";
import {Authentication} from "./Authentication";
import {AuthenticationProvider} from "./AuthenticationProvider";
import {UserProvider} from "./UserProvider/UserProvider";

/**
 * This class is kind of like a proxy for accessing Authentication without
 * using injection in your controllers/classes. It will just allow
 * for some easy access to the authentication logic/handling.
 */
export class Auth {

	public static check() {
		return resolve(Authentication).check();
	}

	public static async attempt(credentials: AuthCredentialContract) {
		return resolve(Authentication).attempt(credentials);
	}

	public static authoriseAs<T>(user: Authenticatable<T>) {
		return resolve(Authentication).authoriseAs(user);
	}

	public static user<T>(): Authenticatable<T> | null {
		return resolve(Authentication).user();
	}

	public static getAuthProvider<T extends AuthenticationProvider>(
		providerType: new (userProvider: UserProvider) => AuthenticationProvider
	): T {
		return resolve(Authentication).getAuthProvider(providerType) as T;
	}

	public static getUserProvider(): UserProvider {
		return resolve(Authentication).getUserProvider();
	}

}
