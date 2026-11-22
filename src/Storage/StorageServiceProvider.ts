import {ServiceProvider} from "../AppContainer/ServiceProvider";
import type {AppContract} from "../Contracts/AppContainer/AppContract";
import type {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Storage} from "./Storage";

export class StorageServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		app.container().register(Storage, {
			useFactory : () => {
				return new Storage(config.get('Storage'));
			}
		});
	}

	public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

	}

}
