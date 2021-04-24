import {Authenticatable} from "../Common";
import {Request} from "../Routing";

export abstract class AuthenticationProvider {

	public abstract getAuthenticationInformation(request: Request);

	public abstract validateAuthenticationInformation(credential: any);

	public abstract authoriseRequest(request: Request): Promise<Authenticatable>

	//	public abstract verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>

}
