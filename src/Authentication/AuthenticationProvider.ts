import {Authenticatable} from "../Common";
import {AuthCredentialContract} from "../Config/Auth";
import {Request} from "../Routing";

export abstract class AuthenticationProvider {

	public abstract getAuthenticationCredential(request: Request);

	public abstract verifyAuthenticationCredential(credential: any);

	public abstract authoriseRequest(request: Request): Promise<Authenticatable>

	public abstract verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>

}
