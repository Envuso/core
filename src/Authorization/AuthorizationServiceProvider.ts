import {ServiceProvider} from "../AppContainer";
import {App, ConfigRepository} from "../AppContainer";
import {Authentication} from "../Authentication";
import {Authorization} from "./Authorization";


export class AuthorizationServiceProvider extends ServiceProvider {

	public async register(app: App, config: ConfigRepository) {
		app.container().register(Authorization, {useValue : new Authorization()});
	}

	public async boot(app: App, config: ConfigRepository) {

	}

}
