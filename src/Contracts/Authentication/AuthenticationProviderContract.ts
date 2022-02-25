import {Jwt, VerifyOptions} from "jsonwebtoken";
import {VerifiedTokenInterface} from "../../Authentication";
import {RequestContract} from "../Routing/Context/Request/RequestContract";
import {AuthenticatableContract} from "./UserProvider/AuthenticatableContract";

export interface AuthenticationProviderContract {
	getTokenFromHeader?(request: RequestContract): string | null
	verifyToken?<T extends Jwt | VerifiedTokenInterface>(token: string, secret?: string, jwtVerifyOptions?: VerifyOptions): T
	getUserIdFromToken?(request: RequestContract|null, specifiedToken?: string | null)

	getAuthenticationInformation(request: RequestContract): any;

	validateAuthenticationInformation(credential: any): any;

	authoriseRequest<T>(request: RequestContract): Promise<AuthenticatableContract<T>>;
}
