import {Authenticatable} from "../Common";
import {Request} from "../Routing";

export abstract class AuthenticationProvider {

	public abstract getAuthenticationInformation(request: Request);

	public abstract validateAuthenticationInformation(credential: any);

	public abstract authoriseRequest<T>(request: Request): Promise<Authenticatable<T>>

	//	public abstract verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>

}
