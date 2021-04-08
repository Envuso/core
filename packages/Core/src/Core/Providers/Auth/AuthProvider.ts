import {AuthCredentialContract} from "@App/Contracts/AuthContracts";
import {User} from "@App/Models/User";
import {Config} from "@Config";
import {FastifyReply, FastifyRequest} from "fastify";
import {injectable} from "inversify";
import {HttpContext, JwtAuthProvider, resolve} from "@Core";
import {Hash} from "../Crypt/Hash";
import {Auth} from "./Auth";


@injectable()
export class AuthProvider {

//	@inject(JwtAuthProvider)
//	private jwtAuthProvider: JwtAuthProvider;

	/**
	 * Attempt to authorise this request using JWT, there
	 * is no JWT or it's invalid, this will return null
	 *
	 * @param request
	 * @param reply
	 */
	async authoriseRequest(request: FastifyRequest, reply: FastifyReply) {

		const token = resolve(JwtAuthProvider).getTokenFromHeader(request);

		if (!token) {
			return null;
		}

		const verifiedToken = resolve(JwtAuthProvider).verifyToken(request);

		if (!verifiedToken) {
			return null;
		}

		const userId = verifiedToken?.id || null;

		if (!userId) {
			return null;
		}

		const user: User = await User.find(userId);

		this.authoriseAs(user);

		return Auth.user();
	}

	/**
	 * Gets the user from the credentials.
	 * Primarily uses the {@see Config.auth.primaryLoginCredential} to check if
	 * a user has registered with this already, if they have, it will return the user.
	 *
	 * @param credentials
	 */
	async userFromCredentials(credentials: AuthCredentialContract) {
		const primaryCredentialName = Config.auth.primaryLoginCredential;
		const primaryCredential     = credentials[primaryCredentialName];

		const userCall                  = {};
		userCall[primaryCredentialName] = primaryCredential.toLowerCase();

		const user = await User.where<User>(userCall).first();

		if (!user) {
			return null;
		}

		return user;
	}

	/**
	 * If we can get the user from {@see userFromCredentials} then we will compare
	 * that users hashed password with the provided password
	 *
	 * @param credentials
	 */
	async verifyCredentials(credentials: AuthCredentialContract) {

		const user = await this.userFromCredentials(credentials);

		if (!user) {
			return null;
		}

		if (!Hash.check(credentials.password, user.password)) {
			return null;
		}

		return user;
	}

	/**
	 * Authorise as x user. This will force auth the
	 * provided user for this request basically.
	 *
	 * @param user
	 */
	public authoriseAs(user: User) {
		HttpContext.get().setUser(user);
//		RequestStore.get().context()
//			.container
//			.bind<AuthorisedUser>(TYPE.User)
//			.toConstantValue(new AuthorisedUser(user));
	}

	jwtProvider(): JwtAuthProvider {
		return resolve(JwtAuthProvider);
	}

}
