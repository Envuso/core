import {Authenticatable} from "@envuso/common/dist";
import {AuthenticationIdentifier} from "../../Config/Auth";
import {UserProvider} from "./UserProvider";

export class BaseUserProvider extends UserProvider {

	async getUser(id: string): Promise<Authenticatable> {
		return new Authenticatable(id);
	}

	async userForIdentifier(identifier: AuthenticationIdentifier): Promise<Authenticatable> {
		return new Authenticatable(identifier);
	}

}
