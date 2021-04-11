import {Authenticatable} from "@envuso/common";
import {Request, Response} from "@envuso/routing";
import {AuthCredentialContract, AuthenticationIdentifier} from "../Config/Auth";
import {JwtAuthenticationProvider} from "./JwtAuthentication/JwtAuthenticationProvider";

export abstract class AuthenticationProvider {

	public abstract getAuthenticationCredential(request: Request);

	public abstract verifyAuthenticationCredential(credential: any);

	public abstract authoriseRequest(request: Request): Promise<Authenticatable>

	public abstract verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>

}
