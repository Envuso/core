import {Jwt, SignOptions, VerifyOptions} from "jsonwebtoken";
import {config, ConfigRepository, resolve} from "../../AppContainer";
import {Authenticatable} from "../../Authenticatable";
import {Exception} from "../../Common";
import {Log} from "../../Common/Logger/Log";
import {AuthenticatableContract} from "../../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {UserProviderContract} from "../../Contracts/Authentication/UserProvider/UserProviderContract";
import {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import {AuthenticationProvider} from "../AuthenticationProvider";
import {VerifiedTokenInterface} from "./JwtAuthenticationProvider";

export class SessionAuthenticationProvider extends AuthenticationProvider {

	constructor(private userProvider: UserProviderContract) {
		super();
	}

	getTokenFromHeader(request: RequestContract): string | null {
		throw new Exception('This method is not implemented on SessionAuthenticationProvider.');
	}

	verifyToken<T extends Jwt | VerifiedTokenInterface>(token: string, secret?: string, jwtVerifyOptions?: VerifyOptions): T {
		throw new Exception('This method is not implemented on SessionAuthenticationProvider.');
	}

	getUserIdFromToken(request: RequestContract | null, specifiedToken?: string | null) {
		throw new Exception('This method is not implemented on SessionAuthenticationProvider.');
	}


	public async authoriseRequest<T>(request: RequestContract): Promise<AuthenticatableContract<T>> {

		const user = await this.userProvider.getUser<T>(
			this.getAuthenticationInformation(request)
		);

		if (!user) {
			return null;
		}

		return resolve<AuthenticatableContract<T>>('Authenticatable').setUser(user.getUser());
	}

	public getAuthenticationInformation<T>(request: RequestContract) {
		if (!request.session()) {
			return null;
		}

		const userId = request.session().store().get<string>('user_id', null);

		return userId ?? null;
	}

	public validateAuthenticationInformation<T>(credential: any) {
		return true;
	}

}
