import {AbstractOAuthUser, OAuthUserContract} from "../../AbstractOAuthUser";
import {OAuthAccessToken} from "../../OAuthAccessToken";

export class Oauth2User extends AbstractOAuthUser implements OAuthUserContract {
	private _token: OAuthAccessToken = new OAuthAccessToken();

	public token(): OAuthAccessToken {
		return this._token;
	}

	public setToken(token: OAuthAccessToken) {
		this._token = token;
		return this;
	}

	public getAccessToken(): string {
		return this._token?.getAccessToken();
	}

	public getRefreshToken(): string {
		return this._token?.getRefreshToken();
	}

	public getExpiryDate(): Date {
		return this._token?.getExpiryDate();
	}

	public getExpiresIn(): number {
		return this._token?.getExpiresIn();
	}

	public getApprovedScopes(): string[] {
		return this._token?.getScopes();
	}
}
