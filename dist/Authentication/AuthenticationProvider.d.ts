import { Authenticatable } from "../Common";
import { AuthCredentialContract } from "../Config/Auth";
import { Request } from "../Routing";
export declare abstract class AuthenticationProvider {
    abstract getAuthenticationCredential(request: Request): any;
    abstract verifyAuthenticationCredential(credential: any): any;
    abstract authoriseRequest(request: Request): Promise<Authenticatable>;
    abstract verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>;
}
