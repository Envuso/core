import axios from "axios";
import {OAuthProviderConfiguration, BaseOAuthProvider} from "../../BaseOAuthProvider";
import {InvalidOAuthGetUserResponseException} from "../../Exceptions/InvalidOAuthGetUserResponseException";
import {Oauth2ProviderContract} from "../Oauth2Provider";
import {Oauth2User} from "./Oauth2User";

export interface TwitchOAuthProviderUserResponse {
	id: string;
	login: string;
	display_name: string;
	type: string;
	broadcaster_type: string;
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number,
	email: string;
	created_at: string;
}

export class TwitchOauthProvider extends BaseOAuthProvider implements Oauth2ProviderContract<any> {

	/**
	 * OAuth scopes to use for the request
	 * @type {string[]}
	 * @private
	 */
	protected _scopes: string[] = ['user:read:email'];

	build(config: OAuthProviderConfiguration) {
		return new TwitchOauthProvider({
			baseUrl           : "https://id.twitch.tv",
			authorizeEndpoint : "/oauth2/authorize",
			tokenEndpoint     : "/oauth2/token",
		}, 'twitch');
	}

	protected async getUserByToken(token: string) {
		try {
			const response = await axios.get<{data: TwitchOAuthProviderUserResponse[]}>(
				'https://api.twitch.tv/helix/users', {
					headers : {
						'Content-Type'  : 'application/json',
						'Accept'        : 'application/json',
						'Authorization' : `Bearer ${token}`,
						'Client-Id'     : this.config.clientId,
					}
				}
			);

			return response.data?.data[0];
		} catch(error) {
			throw new InvalidOAuthGetUserResponseException(error?.response?.data || {});
		}
	}

	protected mapToUser<T extends TwitchOAuthProviderUserResponse>(response: T): Oauth2User {
		return (new Oauth2User())
			.setRaw(response)
			.map({
				id       : response.id,
				username : response.display_name,
				name     : response.login,
				email    : response.email,
				avatar   : response.profile_image_url,
			});
	}

}
