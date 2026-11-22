import {ServiceProvider} from "../AppContainer/ServiceProvider";
import type {AppContract} from "../Contracts/AppContainer/AppContract";
import type {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Csrf} from "./Csrf";

export class SecurityServiceProvider extends ServiceProvider {
	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		app.container().register('csrf', {useFactory : () => new Csrf()});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}
}
