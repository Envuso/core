import {Jwt, VerifyOptions} from "jsonwebtoken";
import {AuthenticationProviderContract} from "../Contracts/Authentication/AuthenticationProviderContract";
import {AuthenticatableContract} from "../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {RequestContract} from "../Contracts/Routing/Context/Request/RequestContract";
import {VerifiedTokenInterface} from "./AuthenticationProviders/JwtAuthenticationProvider";


export abstract class AuthenticationProvider implements AuthenticationProviderContract {


	public abstract getTokenFromHeader?(request: RequestContract): string | null
	public abstract verifyToken?<T extends Jwt | VerifiedTokenInterface>(token: string, secret?: string, jwtVerifyOptions?: VerifyOptions): T
	public abstract getUserIdFromToken?(request: RequestContract|null, specifiedToken?: string | null)

	public abstract getAuthenticationInformation(request: RequestContract);

	public abstract validateAuthenticationInformation(credential: any);

	public abstract authoriseRequest<T>(request: RequestContract): Promise<AuthenticatableContract<T>>

	//	public abstract verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>

}
