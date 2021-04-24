import { Authenticatable } from "../Common";
import { Request } from "../Routing";
export declare abstract class AuthenticationProvider {
    abstract getAuthenticationInformation(request: Request): any;
    abstract validateAuthenticationInformation(credential: any): any;
    abstract authoriseRequest(request: Request): Promise<Authenticatable>;
}
