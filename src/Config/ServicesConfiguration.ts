import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import Environment from "../AppContainer/Config/Environment";
import {OAuthProviderConfiguration} from "../OAuthProvider/BaseOAuthProvider";


export default class ServicesConfiguration extends ConfigurationCredentials {


	twitch: OAuthProviderConfiguration = {
		baseUrl           : "https://id.twitch.tv",
		authorizeEndpoint : "/oauth2/authorize",
		tokenEndpoint     : "/oauth2/token",
		redirectUrl       : "https://api.envuso.test/auth/callback",
		clientId          : this.env<string>('TWITCH_CLIENT_ID'),
		clientSecret      : this.env<string>('TWITCH_CLIENT_SECRET'),
	};
}
