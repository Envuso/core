import axios from "axios";
import path from "node:path";
import qs from "querystring";
import {injectable} from "tsyringe";
import {config} from "../AppContainer";
import {request, response} from "../Routing";

import * as https from 'https';

https.globalAgent.options.rejectUnauthorized = false;

export interface OAuthProviderConfiguration {
	baseUrl: string;
	authorizeEndpoint: string;
	tokenEndpoint: string;
	redirectUrl: string;
	clientId: string;
	clientSecret: string;
	scopes: any[];
}

export interface OAuthProviders {
	[key: string]: OAuthProviderConfiguration;
}

@injectable()
export class OAuthService {

	config: OAuthProviderConfiguration;

	constructor(config: OAuthProviders, serviceName: string) {
		if (!config[serviceName]) {
			throw new Error('OAuth service configuration does not exist.');
		}

		this.config = config[serviceName];
	}

	static forService(serviceName: string): OAuthService {
		return new OAuthService(
			config().get<string, any>('Services.oauthProviders'),
			serviceName
		);
	}


	getRedirectUrl(): string {
		const authUrl = path.join(this.config.baseUrl, this.config.authorizeEndpoint);

		const query = qs.stringify({
			client_id     : this.config.clientId,
			redirect_uri  : this.config.redirectUrl,
			response_type : 'code',
			scope         : this.config.scopes.join(','),
		});

		return `${authUrl}?${query}`;
	}

	redirect() {
		return response().redirect(this.getRedirectUrl());
	}

	async getUser<T>() {
		const code = request().get<string>('code');

		if (!code) {
			throw new Error('Authorization code does not exist on response.');
		}
		const query = qs.stringify({
			client_id     : this.config.clientId,
			client_secret : this.config.clientSecret,
			code          : code,
			redirect_uri  : this.config.redirectUrl,
		});

		const authUrl       = `${path.join(this.config.baseUrl, this.config.tokenEndpoint)}`;
		const authorization = 'Basic ' + (Buffer.from(this.config.clientId + ':' + this.config.clientSecret).toString('base64'));

		try {
			const response = await axios({
				url          : authUrl,
				method       : 'post',
				maxRedirects : 0,
				headers      : {
					//								'Authorization' : authorization,
					'Content-Type' : 'application/json',
					'Accept'       : 'application/json',
				},
				params       : {
					client_id     : this.config.clientId,
					client_secret : this.config.clientSecret,
					code          : code,
					redirect_uri  : this.config.redirectUrl,
					grant_type    : 'authorization_code',
				}
			});

			return response.data;
		} catch (e) {
			console.log(e.response.body);
		}

	}

}
