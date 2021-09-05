import {Authenticatable} from "../../Authenticatable";
import {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import {AuthenticationProvider} from "../AuthenticationProvider";

export class SessionAuthenticationProvider extends AuthenticationProvider {

	public async authoriseRequest<T>(request: RequestContract): Promise<Authenticatable<T>> {
		return Promise.resolve(undefined);
	}

	public getAuthenticationInformation<T>(request: RequestContract) {
	}

	public validateAuthenticationInformation<T>(credential: any) {
	}

}
