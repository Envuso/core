import axios from "axios";
import * as https from 'https';
import {injectable} from "tsyringe";
import {URLSearchParams} from 'url';
import {Str} from "../Common";
import {Url} from "../Common/Http/ExtendedUrl";
import {RedirectResponseContract} from "../Contracts/Routing/Context/Response/RedirectResponseContract";
import {request, RequestContext, response} from "../Routing";
import {session} from "../Session";
import {InvalidAccessTokenResponseException} from "./Exceptions/InvalidAccessTokenResponseException";
import {InvalidStateException} from "./Exceptions/InvalidStateException";
import {OAuthAccessToken, OAuthAccessTokenRaw} from "./OAuthAccessToken";
import {Oauth2User} from "./Providers/OAuth2/Oauth2User";

https.globalAgent.options.rejectUnauthorized = false;

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
			this._urlParams.set(attributesKey, attributes[attributesKey]);
		}

		return this;
	}

	protected getAuthFields(state?: string): URLSearchParams {
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

		return fields;
	}

	/**
	 * Build the authorization redirect url
	 *
	 * @param {string|undefined} state
	 * @returns {string}
	 */
	protected buildAuthUrl(state?: string): string {
		const url    = new Url(this.config.authorizeEndpoint, this.config.baseUrl);
		const fields = this.getAuthFields(state);
		url.mergeSearchParams(fields);

		return url.toString();
	}

	protected getAuthUrl(state?: string): string {
		return this.buildAuthUrl(state);
	}

	protected hasInvalidState(): boolean {
		if (this.isStateless()) {
			return false;
		}

		if (!RequestContext.isUsingSession()) {
			return false;
		}

		const state = session().store().pull<string>(`OAuthProvider.${this.service}.state`);
		if (!state) {
			return true;
		}

		return request('state') !== state;
	}

	/**
	 * Redirect the user to the authorize url
	 *
	 * @returns {RedirectResponseContract}
	 */
	redirect(): RedirectResponseContract {
		const state = this.isStateless() ? undefined : this.getState();

		if (this.usesState() && RequestContext.isUsingSession()) {
			session().store().put(`OAuthProvider.${this.service}.state`, state);
		}

		return response().redirect(this.getAuthUrl(state));
	}

	protected getCode(): string | null {
		return request<string>('code');
	}

	protected getAccessTokenFields(code: string) {
		return new URLSearchParams({
			client_id     : this.config.clientId,
			client_secret : this.config.clientSecret,
			grant_type    : 'authorization_code',
			code          : code,
			redirect_uri  : this.config.redirectUrl,
		});
	}

	protected async getAccessTokenResponse(code: string): Promise<OAuthAccessToken> {
		const url = new Url(this.config.tokenEndpoint, this.config.baseUrl);

		try {
			const response = await axios.post<OAuthAccessTokenRaw>(url.toString(), this.getAccessTokenFields(code), {
				headers : {'Accept' : 'application/json'}
			});

			return new OAuthAccessToken(response?.data);
		} catch (error) {
			throw new InvalidAccessTokenResponseException(error?.response?.data || {});
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

		const authorizationCodeResponse = await this.getAccessTokenResponse(this.getCode());
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

	protected getState() {
		return Str.uniqueRandom(40);
	}

}
