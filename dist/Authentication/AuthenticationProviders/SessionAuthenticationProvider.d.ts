import { Authenticatable } from "../../Common";
import { Request } from "../../Routing";
import { AuthenticationProvider } from "../AuthenticationProvider";
export declare class SessionAuthenticationProvider extends AuthenticationProvider {
    authoriseRequest<T>(request: Request): Promise<Authenticatable<T>>;
    getAuthenticationInformation<T>(request: Request): void;
    validateAuthenticationInformation<T>(credential: any): void;
}
