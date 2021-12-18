import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Authorization} from "./Authorization";


export class AuthorizationServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		app.container().register(Authorization, {useValue : new Authorization()});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}

}
