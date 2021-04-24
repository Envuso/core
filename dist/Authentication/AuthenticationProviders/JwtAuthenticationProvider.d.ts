import { Authenticatable } from "../../Common";
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
    getAuthenticationInformation(request: Request): string;
    validateAuthenticationInformation(credential: string): VerifiedTokenInterface | null;
    authoriseRequest<T>(request: Request): Promise<Authenticatable<T>>;
    issueToken(id: string): string;
}
