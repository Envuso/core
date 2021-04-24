import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {App, ConfigRepository} from "../AppContainer";

import {Authentication} from "./Authentication";

export class AuthenticationServiceProvider extends ServiceProvider {

	public async register(app: App, config: ConfigRepository) {
		const provider = {
			useFactory : (container) => {
				return new Authentication(container.resolve(ConfigRepository));
			}
		};
		app.container().register(Authentication, provider);
		app.container().register('Authentication', provider);
	}

	public async boot(app: App, config: ConfigRepository) {

	}

}
