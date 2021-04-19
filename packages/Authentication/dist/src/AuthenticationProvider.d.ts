import { Authenticatable } from "@envuso/common";
import { Request } from "@envuso/routing";
import { AuthCredentialContract } from "../Config/Auth";
export declare abstract class AuthenticationProvider {
    abstract getAuthenticationCredential(request: Request): any;
    abstract verifyAuthenticationCredential(credential: any): any;
    abstract authoriseRequest(request: Request): Promise<Authenticatable>;
    abstract verifyLoginCredentials(credentials: AuthCredentialContract): Promise<Authenticatable>;
}
