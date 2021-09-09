import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {SessionManager} from "./SessionManager";

export class SessionServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		app.container().register('SessionManager', {
			useFactory : () => {
				return new SessionManager(config.get('Session'));
			}
		});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}

}
