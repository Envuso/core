import {SignOptions, VerifyOptions} from "jsonwebtoken";
import {JwtAuthenticationProvider} from "../Authentication/JwtAuthentication/JwtAuthenticationProvider";
import {BaseUserProvider} from "../Authentication/UserProvider/BaseUserProvider";

export type AuthenticationIdentifier = keyof AuthCredentialContract;

export interface AuthCredentialContract {
	email: string;
	password: string;
}

export default {

	/**
	 * This will allow you to swap out authentication handling
	 * and build your own custom providers for different things
	 */
	authenticationProvider : JwtAuthenticationProvider,

	/**
	 * This will allow you to change how the user is acquired
	 * For example, you could write a provider to get user
	 * information from an api endpoint, database etc
	 */
	userProvider : BaseUserProvider,

	/**
	 * This will allow users authentication to use email for primary login.
	 * For example, you could change this to "username" instead if
	 * you didn't want to use email registration and login.
	 */
	primaryIdentifier : 'email' as AuthenticationIdentifier,

	jwt : {
		/**
		 * The prefix used in authorization header checks
		 */
		authorizationHeaderPrefix : 'Bearer',

		/**
		 * Used to sign JWT
		 */
		jwtSigningOptions : {
			expiresIn : "24h",
			algorithm : "HS256",
		} as SignOptions,

		/**
		 * Used to verify JWT are valid
		 */
		jwtVerifyOptions : {
			ignoreExpiration : false,
			algorithms       : ["HS256"],
		} as VerifyOptions
	}


}
