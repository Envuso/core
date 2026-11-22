import crypto from "crypto";
import {injectable} from "tsyringe";
import {Str} from "../Common/Utility/Str";
import {Url} from "../Common/Http/ExtendedUrl";
import type {RedirectResponseContract} from "../Contracts/Routing/Context/Response/RedirectResponseContract";
import {request, response} from "../Routing/helpers";
import {RequestContext} from "../Routing/Context/RequestContext";
import {session} from "../Session/helpers";
import {InvalidAccessTokenResponseException} from "./Exceptions/InvalidAccessTokenResponseException";
import {InvalidStateException} from "./Exceptions/InvalidStateException";
import {OAuthAccessToken, type OAuthAccessTokenRaw} from "./OAuthAccessToken";
import {Oauth2User} from "./Providers/OAuth2/Oauth2User";

export interface OAuthProviderConfiguration {
	baseUrl: string;
	authorizeEndpoint: string;
	tokenEndpoint: string;
	redirectUrl?: string;
	clientId?: string;
	clientSecret?: string;
}

export interface OAuthProviders {
	[key: string]: OAuthProviderConfiguration;
}

export interface OAuthServiceContract {

	/**
	 * Add additional parameters to the authorize url
	 * @param {{[p: string]: any}} attributes
	 * @returns {this}
	 */
	with(attributes: { [key: string]: any }): this;

	/**
	 * Add scopes to the authorize request
	 *
	 * @param {string[]} scopes
	 * @returns {this}
	 */
	scopes(scopes: string[]): this;

	setScopes(scopes: string[]): this;

	/**
	 * Redirect the user to the authorize url
	 *
	 * @returns {RedirectResponseContract}
	 */
	redirect(): RedirectResponseContract;
}

@injectable()
export class BaseOAuthProvider implements OAuthServiceContract {

	public scopeSeparator: string = ',';

	service: string;
	config: OAuthProviderConfiguration;

	protected _user: Oauth2User = null;

	/**
	 * Additional URL Query Parameters to merge with the authorize URL
	 * @type {URLSearchParams}
	 * @private
	 */
	protected _urlParams: URLSearchParams = new URLSearchParams();

	/**
	 * OAuth scopes to use for the request
	 * @type {string[]}
	 * @private
	 */
	protected _scopes: string[] = [];

	/**
	 * Whether a state string should be generated for the request
	 * @type {boolean}
	 * @private
	 */
	private _stateless: boolean = false;

	/**
	 * Send a PKCE (S256) challenge with the authorize request. Needs the session (it holds the verifier).
	 */
	private _pkce: boolean = true;

	/**
	 * Parameters with() can't override: they're what the code exchange is checked against
	 */
	protected static readonly RESERVED_PARAMS = ['client_id', 'redirect_uri', 'response_type', 'state', 'code_challenge', 'code_challenge_method'];

	constructor(config: OAuthProviderConfiguration, serviceName: string) {
		if (!config) {
			throw new Error('OAuth service configuration does not exist.');
		}

		this.service = serviceName;
		this.config  = config;
	}

	setConfig(config: OAuthProviderConfiguration) {
		for (let configKey in config) {
			if(!this.config[configKey]) {
				this.config[configKey] = config[configKey];
			}
		}
		return this;
	}

	public build(config: OAuthProviderConfiguration): BaseOAuthProvider {
		return new (this as any)(config, 'BaseProvider.');
	}

	/**
	 * Add scopes to the authorize request
	 *
	 * @param {string[]} scopes
	 * @returns {this}
	 */
	scopes(scopes: string[]): this {
		scopes.forEach(scope => {
			if (!this._scopes.includes(scope)) {
				this._scopes.push(scope);
			}
		});

		return this;
	}

	setScopes(scopes: string[]): this {
		this._scopes = scopes;
		return this;
	}

	/**
	 * Add additional parameters to the authorize url
	 * @param {{[p: string]: any}} attributes
	 * @returns {this}
	 */
	with(attributes: { [key: string]: any }): this {
		for (let attributesKey in attributes) {
			if (BaseOAuthProvider.RESERVED_PARAMS.includes(attributesKey)) {
				throw new Error(`OAuth: "${attributesKey}" can't be set with with(); it comes from the provider config or is generated.`);
			}
			this._urlParams.set(attributesKey, attributes[attributesKey]);
		}

		return this;
	}

	protected getAuthFields(state?: string, codeChallenge?: string): URLSearchParams {
		const fields = new URLSearchParams({
			client_id     : this.config.clientId,
			redirect_uri  : this.config.redirectUrl,
			scope         : this._scopes.join(this.scopeSeparator),
			response_type : 'code',
		});

		this._urlParams.forEach((value, key) => {
			fields.set(key, value);
		});

		if (this.usesState() && state) {
			fields.set('state', state);
		}

		if (codeChallenge) {
			fields.set('code_challenge', codeChallenge);
			fields.set('code_challenge_method', 'S256');
		}

		return fields;
	}

	/**
	 * Build the authorization redirect url
	 *
	 * @param {string|undefined} state
	 * @returns {string}
	 */
	protected buildAuthUrl(state?: string, codeChallenge?: string): string {
		const url    = new Url(this.config.authorizeEndpoint, this.config.baseUrl);
		const fields = this.getAuthFields(state, codeChallenge);
		url.mergeSearchParams(fields);

		return url.toString();
	}

	protected getAuthUrl(state?: string, codeChallenge?: string): string {
		return this.buildAuthUrl(state, codeChallenge);
	}

	protected sessionKey(name: 'state' | 'verifier') {
		return `OAuthProvider.${this.service}.${name}`;
	}

	protected hasInvalidState(): boolean {
		if (this.isStateless()) {
			return false;
		}

		// Without a session there is nothing to check the state against; that used to
		// skip the check (login CSRF). It's invalid instead
		if (!RequestContext.isUsingSession()) {
			return true;
		}

		const state    = session().store().pull<string>(this.sessionKey('state'));
		const returned = request<string>('state');

		if (!state || typeof returned !== 'string') {
			return true;
		}

		const expected = Buffer.from(state);
		const actual   = Buffer.from(returned);

		return expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual);
	}

	/**
	 * Redirect the user to the authorize url
	 *
	 * @returns {RedirectResponseContract}
	 */
	redirect(): RedirectResponseContract {
		if (this.isStateless()) {
			return response().redirect(this.getAuthUrl());
		}

		if (!RequestContext.isUsingSession()) {
			throw new Error(`OAuth (${this.service}): the state check needs a session. Start one (StartSessionMiddleware), or call stateless().`);
		}

		const state = this.getState();
		session().store().put(this.sessionKey('state'), state);

		let challenge: string = undefined;
		if (this.usesPkce()) {
			const verifier = crypto.randomBytes(32).toString('base64url');
			session().store().put(this.sessionKey('verifier'), verifier);
			challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
		}

		return response().redirect(this.getAuthUrl(state, challenge));
	}

	protected getCode(): string | null {
		return request<string>('code');
	}

	protected getAccessTokenFields(code: string) {
		const fields = new URLSearchParams({
			client_id     : this.config.clientId,
			client_secret : this.config.clientSecret,
			grant_type    : 'authorization_code',
			code          : code,
			redirect_uri  : this.config.redirectUrl,
		});

		if (this.usesPkce() && RequestContext.isUsingSession()) {
			const verifier = session().store().pull<string>(this.sessionKey('verifier'));
			if (verifier) {
				fields.set('code_verifier', verifier);
			}
		}

		return fields;
	}

	protected async getAccessTokenResponse(code: string): Promise<OAuthAccessToken> {
		const url = new Url(this.config.tokenEndpoint, this.config.baseUrl);

		try {
			const response = await fetch(url.toString(), {
				method  : 'POST',
				body    : this.getAccessTokenFields(code),
				headers : {'Accept' : 'application/json'},
			});
			const data     = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new InvalidAccessTokenResponseException(data);
			}

			return new OAuthAccessToken(data as OAuthAccessTokenRaw);
		} catch (error) {
			if (error instanceof InvalidAccessTokenResponseException) {
				throw error;
			}
			throw new InvalidAccessTokenResponseException({});
		}
	}

	protected async getUserByToken(token: string): Promise<any> {
		return null;
	}

	protected mapToUser<T extends any>(response: T | any): Oauth2User {
		return (new Oauth2User())
			.setRaw(response)
			.map({
				id       : response.id as string,
				username : response.username as string,
				name     : response.name as string,
				email    : response.email as string,
				avatar   : response.avatar as string,
			});
	}

	async user<T>() {
		if (this._user) {
			return this._user;
		}

		if (this.hasInvalidState()) {
			throw new InvalidStateException();
		}

		const code = this.getCode();
		if (!code) {
			throw new InvalidAccessTokenResponseException({error : 'missing_code'});
		}

		const authorizationCodeResponse = await this.getAccessTokenResponse(code);
		const userResponse              = await this.getUserByToken(authorizationCodeResponse.getAccessToken());

		this._user = this.mapToUser<T>(userResponse);

		return this._user.setToken(authorizationCodeResponse.setScopeSeparator(this.scopeSeparator));
	}

	usesState() {
		return !this._stateless;
	}

	stateless() {
		this._stateless = true;
		return this;
	}

	isStateless() {
		return this._stateless;
	}

	/**
	 * Don't send a PKCE challenge (for a provider that rejects it)
	 */
	withoutPkce() {
		this._pkce = false;
		return this;
	}

	usesPkce() {
		return this._pkce && !this._stateless;
	}

	protected getState() {
		return Str.uniqueRandom(40);
	}

}
