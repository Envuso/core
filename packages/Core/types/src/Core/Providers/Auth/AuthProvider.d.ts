import { FastifyReply, FastifyRequest } from "fastify";
import { AuthCredentialContract } from "@App/Contracts/AuthContracts";
import { User } from "@App/Models/User";
import { JwtAuthProvider } from "@Core/Providers/Auth";
export declare class AuthProvider {
    /**
     * Attempt to authorise this request using JWT, there
     * is no JWT or it's invalid, this will return null
     *
     * @param request
     * @param reply
     */
    authoriseRequest(request: FastifyRequest, reply: FastifyReply): Promise<import("@Core/Providers/Auth").AuthorisedUser>;
    /**
     * Gets the user from the credentials.
     * Primarily uses the {@see Config.auth.primaryLoginCredential} to check if
     * a user has registered with this already, if they have, it will return the user.
     *
     * @param credentials
     */
    userFromCredentials(credentials: AuthCredentialContract): Promise<User>;
    /**
     * If we can get the user from {@see userFromCredentials} then we will compare
     * that users hashed password with the provided password
     *
     * @param credentials
     */
    verifyCredentials(credentials: AuthCredentialContract): Promise<User>;
    /**
     * Authorise as x user. This will force auth the
     * provided user for this request basically.
     *
     * @param user
     */
    authoriseAs(user: User): void;
    jwtProvider(): JwtAuthProvider;
}
