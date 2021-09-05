import {JwtAuthenticationConfig, VerifiedTokenInterface} from "../../../Authentication";
import {RequestContract} from "../../Routing/Context/Request/RequestContract";
import {AuthenticatableContract} from "../UserProvider/AuthenticatableContract";
import {UserProviderContract} from "../UserProvider/UserProviderContract";

export interface JwtAuthenticationProviderContract {
	_config: JwtAuthenticationConfig;
	_appKey: string;
	_userProvider: UserProviderContract;

	getAuthenticationInformation(request: RequestContract): string | null;

	validateAuthenticationInformation<T extends VerifiedTokenInterface>(credential: string): T | null;

	authoriseRequest<T>(request: RequestContract): Promise<AuthenticatableContract<T>>;

	issueToken(id: string, additionalPayload?: any): string;
}
