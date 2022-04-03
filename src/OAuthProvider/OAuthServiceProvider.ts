import {ServiceProvider} from "../AppContainer";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Socialite} from "./Socialite";

export class OAuthServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		Socialite.createDrivers();
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
	}


}
