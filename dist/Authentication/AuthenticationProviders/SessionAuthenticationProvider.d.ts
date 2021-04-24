import { Authenticatable } from "../../Common";
import { Request } from "../../Routing";
import { AuthenticationProvider } from "../AuthenticationProvider";
export declare class SessionAuthenticationProvider extends AuthenticationProvider {
    authoriseRequest(request: Request): Promise<Authenticatable>;
    getAuthenticationInformation(request: Request): void;
    validateAuthenticationInformation(credential: any): void;
}
