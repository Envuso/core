import { Authenticatable } from "../../Common";
import { AuthCredentialContract } from "../../Config/Auth";
import { Request } from "../../Routing";
import { AuthenticationProvider } from "../AuthenticationProvider";
import { UserProvider } from "../UserProvider/UserProvider";
export interface VerifiedTokenInterface {
    id: string;
    iat: number;
    exp: number;
    iss: string;
}
export declare class JwtAuthenticationProvider extends AuthenticationProvider {
    private _config;
    private _appKey;
    private _userProvider;
    constructor(userProvider: UserProvider);
    getAuthenticationCredential(request: Request): string;
    verifyAuthenticationCredential(credential: string): VerifiedTokenInterface | null;
    authoriseRequest(request: Request): Promise<Authenticatable>;
    verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>;
    issueToken(id: string): string;
}
