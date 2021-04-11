import {App, ConfigRepository, ServiceProvider} from "@envuso/app";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {Authentication} from "./Authentication";

export class AuthenticationServiceProvider extends ServiceProvider {

	public async register(app: App, config: ConfigRepository) {
		app.container().register(Authentication, {
			useFactory : (container) => {
				return new Authentication(container.resolve(ConfigRepository));
			}
		})

//		app.bind(() => {
//			return new Authentication(config);
//		}, Authentication);
	}

	public async boot(app: App, config: ConfigRepository) {

	}

}
