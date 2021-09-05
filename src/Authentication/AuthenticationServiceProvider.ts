import {ConfigRepository} from "../AppContainer";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {Authenticatable} from "../Authenticatable";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Authentication} from "./Authentication";


export class AuthenticationServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		const provider = {
			useFactory : (container) => {
				return new Authentication(container.resolve(ConfigRepository));
			}
		};
		app.container().register('Authenticatable', Authenticatable);
		app.container().register(Authentication, provider);
		app.container().register('Authentication', provider);
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}

}
