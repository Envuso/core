import {RequestContract} from "../Routing/Context/Request/RequestContract";
import {AuthenticatableContract} from "./UserProvider/AuthenticatableContract";

export interface AuthenticationProviderContract {
	getAuthenticationInformation(request: RequestContract): any;

	validateAuthenticationInformation(credential: any): any;

	authoriseRequest<T>(request: RequestContract): Promise<AuthenticatableContract<T>>;
}
