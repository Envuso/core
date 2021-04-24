import {Authenticatable} from "../../Common";
import {Request} from "../../Routing";
import {AuthenticationProvider} from "../AuthenticationProvider";

export class SessionAuthenticationProvider extends AuthenticationProvider {

	public async authoriseRequest<T>(request: Request): Promise<Authenticatable<T>> {
		return Promise.resolve(undefined);
	}

	public getAuthenticationInformation<T>(request: Request) {
	}

	public validateAuthenticationInformation<T>(credential: any) {
	}

}
