import {OAuthService} from "../../../OAuthProvider/OAuthService";
import {controller, get, request} from "../../../Routing";
import {Controller} from "../../../Routing/Controller/Controller";


@controller('/auth')
export class TestingAuthController extends Controller {
	private driver: OAuthService;

	constructor() {
		super();

		this.driver = OAuthService.forService('twitch');
	}

	@get('/redirect')
	async redirect() {
		return this.driver.redirect();
	}

	@get('/callback')
	async callback() {
		console.log(request().all());
		console.log(request().get('code'));

		const user = await this.driver.getUser();

		console.log(user);

		return {};
	}

}
