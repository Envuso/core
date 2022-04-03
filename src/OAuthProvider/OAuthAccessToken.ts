import {Value} from "../Common/Utility/Value";

export interface OAuthAccessTokenRaw {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope?: string[];
	token_type?: string;
	obtained_at?: number;
}

const EXPIRY_GRACE_PERIOD = 60000;

export type OAuthAccessTokenAll = {
	scopeSeparator: string;
	accessToken: string;
	refreshToken: string;
	scopes: string[];
	tokenType: string;
	obtainedAt: number;
	expiresIn: number;
	expiresAt: Date | null;
	hasExpired: boolean;
}

export class OAuthAccessToken {
	private _scopeSeparator: string = ',';
	private _accessToken: string    = null;
	private _refreshToken: string   = null;
	private _scopes: string []      = null;
	private _tokenType: string      = null;
	private _obtainedAt: number     = null;
	private _expiresIn: number      = null;

	constructor(raw?: OAuthAccessTokenRaw) {
		this._accessToken  = raw?.access_token || null;
		this._expiresIn    = raw?.expires_in || null;
		this._refreshToken = raw?.refresh_token || null;
		this._scopes       = raw?.scope || null;
		this._tokenType    = raw?.token_type || null;
		this._obtainedAt   = raw?.obtained_at || Date.now();
	}

	getScopeSeparator(): string {
		return this._scopeSeparator;
	}

	setScopeSeparator(separator: string) {
		this._scopeSeparator = separator;
		return this;
	}

	setObtainedAt(obtainedAt: number | Date) {
		if (obtainedAt instanceof Date) {
			obtainedAt = obtainedAt.getTime();
		}
		this._obtainedAt = obtainedAt;

		return this;
	}

	private getExpiryMillis(): number | null {
		return Value.nullable(this._expiresIn, _ => this._obtainedAt + _ * 1000 - EXPIRY_GRACE_PERIOD);
	}

	getExpiryDate(): Date | null {
		return Value.nullable(this.getExpiryMillis(), _ => new Date(_));
	}

	hasExpired(): boolean {
		const expired = Value.nullable(this.getExpiryMillis(), _ => Date.now() > _);
		return expired === null ? false : expired;
	}

	getAccessToken(): string {
		return this._accessToken;
	}

	getRefreshToken(): string {
		return this._refreshToken;
	}

	getScopes(): string[] {
		return this._scopes;
	}

	getTokenType(): string {
		return this._tokenType;
	}

	getObtainedAt(): number {
		return this._obtainedAt;
	}

	getExpiresIn(): number {
		return this._expiresIn;
	}

	all(): OAuthAccessTokenAll {
		return {
			scopeSeparator : this.getScopeSeparator(),
			expiresAt      : this.getExpiryDate(),
			hasExpired     : this.hasExpired(),
			accessToken    : this.getAccessToken(),
			refreshToken   : this.getRefreshToken(),
			scopes         : this.getScopes(),
			tokenType      : this.getTokenType(),
			obtainedAt     : this.getObtainedAt(),
			expiresIn      : this.getExpiresIn(),
		};
	}

}
