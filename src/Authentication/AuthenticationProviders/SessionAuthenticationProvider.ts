import {Authenticatable} from "../../Common";
import {Request} from "../../Routing";
import {AuthenticationProvider} from "../AuthenticationProvider";

export class SessionAuthenticationProvider extends AuthenticationProvider {

	public async authoriseRequest(request: Request): Promise<Authenticatable> {
		return Promise.resolve(undefined);
	}

	public getAuthenticationInformation(request: Request) {
	}

	public validateAuthenticationInformation(credential: any) {
	}

}
