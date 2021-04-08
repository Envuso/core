import {injectable} from "inversify";
import {AuthCredentialContract} from "@App/Contracts/AuthContracts";
import {User} from "@App/Models/User";
import {resolve} from "@Core";
import {HttpContext} from "../Http/Context/HttpContext";
import {AuthorisedUser} from "./AuthorisedUser";
import {AuthProvider} from "./AuthProvider";

@injectable()
export class Auth {

	constructor() {

	}

	/**
	 * Attempt to login with the credentials
	 *
	 * @param credentials
	 */
	static async attempt(credentials: AuthCredentialContract) {

		const authProvider = resolve(AuthProvider);

		const user: User | null = await authProvider.verifyCredentials(credentials);

		if (!user) {
			return false;
		}

		this.loginAs(user);

		return true;
	}

	/**
	 * Force login to x user
	 *
	 * @param user
	 */
	public static loginAs(user: User) {
		resolve(AuthProvider).authoriseAs(user);
	}

	/**
	 * Check the credentials to see if the user can register with them
	 * Basically, if x email/username is in use.
	 * @param credentials
	 */
	public static async canRegisterAs(credentials: AuthCredentialContract) {
		const user = await resolve(AuthProvider).userFromCredentials(credentials);

		return user === null;
	}

	/**
	 * Check if there is an authed user
	 */
	static check() {
		return !!this.user();
	}

	/**
	 * Get the currently authed user(if any) from the current Http Context
	 */
	static user(): AuthorisedUser {
		return HttpContext.get().user;
//		return RequestStore.get().context().container.get<AuthorisedUser>(TYPE.User);
	}

}
