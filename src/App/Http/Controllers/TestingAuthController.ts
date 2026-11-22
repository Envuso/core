import {TwitchOauthProvider} from "../../../OAuthProvider/Providers/OAuth2/TwitchOauthProvider";
import {Socialite} from "../../../OAuthProvider/Socialite";
import {controller, get} from "../../../Routing/Controller/ControllerDecorators";
import {redirect, request} from "../../../Routing";
import {Controller} from "../../../Routing/Controller/Controller";


@controller('/auth')
export class TestingAuthController extends Controller {

	constructor() {
		super();

		// Register a custom built provider

		Socialite.register('twitch', TwitchOauthProvider);
	}

	@get('/redirect')
	async redirect() {

		return redirect().to('x').with('x', 'y');

		return Socialite.driver('twitch')
			.scopes(['user:read:email'])
			.redirect();
	}

	@get('/callback')
	async callback() {
		const user = await Socialite.driver('twitch').user();

		user.getId();
		user.getAvatar();
		user.getEmail();
		user.getName();
		user.getUsername();

		user.token().getScopes();
		user.token().getExpiryDate();
		user.token().getAccessToken();
		user.token().getRefreshToken();
		user.token().getExpiresIn();
		user.token().getExpiryDate();
		user.token().hasExpired();
	}

}
