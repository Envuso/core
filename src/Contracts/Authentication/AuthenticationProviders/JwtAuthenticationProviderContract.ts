import {Jwt, SignOptions, VerifyOptions} from "jsonwebtoken";
import {JwtAuthenticationConfig, VerifiedTokenInterface} from "../../../Authentication";
import {RequestContract} from "../../Routing/Context/Request/RequestContract";
import {AuthenticatableContract} from "../UserProvider/AuthenticatableContract";
import {UserProviderContract} from "../UserProvider/UserProviderContract";

export type JwtSingingOptions = SignOptions & { [key: string]: any };

export interface JwtAuthenticationProviderContract {
	_config: JwtAuthenticationConfig;
	_appKey: string;
	_userProvider: UserProviderContract;

	getTokenFromHeader(request: RequestContract): string | null;

	getAuthenticationInformation(request: RequestContract): string | null;

	verifyToken<T extends Jwt | VerifiedTokenInterface>(token: string, secret?: string, jwtVerifyOptions?: VerifyOptions): T;

	validateAuthenticationInformation<T extends VerifiedTokenInterface>(credential: string): T | null;

	getUserIdFromToken(request: RequestContract | null, specifiedToken?: string | null);

	authoriseRequest<T>(request: RequestContract | null, specifiedToken?: string | null): Promise<AuthenticatableContract<T>>;

	issueToken(id: string, additionalPayload?: JwtSingingOptions): string;
}
