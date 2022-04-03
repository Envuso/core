import {OAuthProviderConfiguration} from "../BaseOAuthProvider";
import type {OAuthServiceContract} from "../BaseOAuthProvider";

export interface Oauth2ProviderContract<User extends Object> extends OAuthServiceContract {
	build(config: OAuthProviderConfiguration): Oauth2ProviderContract<User>;

	user(): Promise<User>;
}
