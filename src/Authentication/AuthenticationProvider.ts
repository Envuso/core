import {AuthenticationProviderContract} from "../Contracts/Authentication/AuthenticationProviderContract";
import {AuthenticatableContract} from "../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {RequestContract} from "../Contracts/Routing/Context/Request/RequestContract";


export abstract class AuthenticationProvider implements AuthenticationProviderContract {

	public abstract getAuthenticationInformation(request: RequestContract);

	public abstract validateAuthenticationInformation(credential: any);

	public abstract authoriseRequest<T>(request: RequestContract): Promise<AuthenticatableContract<T>>

	//	public abstract verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>

}
