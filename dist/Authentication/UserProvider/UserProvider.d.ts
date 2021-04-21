import { Authenticatable } from "../../Common";
import { AuthenticationIdentifier } from "../../Config/Auth";
export declare abstract class UserProvider {
    abstract getUser(id: string): Promise<Authenticatable>;
    abstract userForIdentifier(identifier: AuthenticationIdentifier): Promise<Authenticatable>;
}
