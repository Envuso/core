import { AuthenticationIdentifier } from 'Contracts/Authentication/UserProvider/AuthCredentials';
import {sign, SignOptions, verify, VerifyOptions} from 'jsonwebtoken';
import {config, ConfigRepository, resolve} from "../../AppContainer";
import {Log} from "../../Common";
import {JwtAuthenticationProviderContract} from "../../Contracts/Authentication/AuthenticationProviders/JwtAuthenticationProviderContract";
import {AuthenticatableContract} from "../../Contracts/Authentication/UserProvider/AuthenticatableContract";
import {UserProviderContract} from "../../Contracts/Authentication/UserProvider/UserProviderContract";
import {RequestContract} from "../../Contracts/Routing/Context/Request/RequestContract";
import {AuthenticationProvider} from "../AuthenticationProvider";


export interface JwtAuthenticationConfig {
	//primaryIdentifier: AuthenticationIdentifier;
	authorizationHeaderPrefix: string;
	jwtSigningOptions: SignOptions;
	jwtVerifyOptions: VerifyOptions;
}

export interface VerifiedTokenInterface {
	id: string;
	iat: number;
	exp: number;
	iss: string;
}

export class JwtAuthenticationProvider extends AuthenticationProvider implements JwtAuthenticationProviderContract {

	public _config: JwtAuthenticationConfig;
	public _appKey: string;
	public _userProvider: UserProviderContract;

	constructor(userProvider: UserProviderContract) {
		super();
		this._userProvider = userProvider;

		this._appKey = resolve(ConfigRepository).get<string, any>('App.appKey')

		if (!this._appKey) {
			Log.warn('You are trying to use JWT Auth. But there is no app key defined in config(Config/App.ts), which is needed to sign Json Web Tokens.');
			return;
		}

		const authConf = config().get<string, any>('Auth');

		this._config = authConf.jwt ??  {
			/**
			 * The prefix used in authorization header checks
			 */
			authorizationHeaderPrefix : 'Bearer',

			/**
			 * Used to sign JWT
			 */
			jwtSigningOptions : {
				expiresIn : "24h",
				algorithm : "HS256",
			} as SignOptions,

			/**
			 * Used to verify JWT are valid
			 */
			jwtVerifyOptions : {
				ignoreExpiration : false,
				algorithms       : ["HS256"],
			} as VerifyOptions
		};


		if (!this._config?.authorizationHeaderPrefix) {
			this._config.authorizationHeaderPrefix = 'Bearer';
		}
	}

	public getAuthenticationInformation(request: RequestContract) {
		const authHeader = request.getHeader<string>('authorization');

		if (!authHeader) {
			return null;
		}

		const tokenParts = authHeader.split(" ");
		if (tokenParts.length !== 2) {
			return null;
		}

		const type  = tokenParts[0];
		const token = tokenParts[1];
		if (!token || !type) {
			return null;
		}

		if (type && token && type === this._config.authorizationHeaderPrefix) {
			return token;
		}

		return null;
	}

	public validateAuthenticationInformation<T extends VerifiedTokenInterface>(credential: string): T | null {
		if (!credential) {
			return null;
		}

		return <T>verify(
			credential,
			this._appKey,
			this._config.jwtVerifyOptions
		);
	}

	public async authoriseRequest<T>(request: RequestContract): Promise<AuthenticatableContract<T>> {
		const token = this.getAuthenticationInformation(request);

		if (!token) {
			return null;
		}

		const verifiedToken = this.validateAuthenticationInformation(token);

		if (!verifiedToken) {
			return null;
		}

		const userId = verifiedToken?.id;

		if (!userId) {
			return null;
		}

		const user = await this._userProvider.getUser<T>(userId);

		if (!user) {
			return null;
		}

		return resolve<AuthenticatableContract<T>>('Authenticatable')
			.setUser(user.getUser()) as AuthenticatableContract<T>;
	}

	public issueToken(id: string, additionalPayload?: any): string {
		return sign(
			{
				...additionalPayload,
				...{id}
			},
			this._appKey,
			this._config.jwtSigningOptions
		);
	}

}
