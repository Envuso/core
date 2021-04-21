import {App} from "../AppContainer/App";
import {ConfigRepository} from "../AppContainer/Config/ConfigRepository";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {StorageConfig} from "../Config/Storage";
import {Storage} from "./Storage";

export class StorageServiceProvider extends ServiceProvider {

	public async register(app: App, config: ConfigRepository) {
		app.container().register(Storage, {
			useFactory : () => {
				return new Storage(config.get<StorageConfig>('storage'));
			}
		})
	}

	public async boot(app: App, config: ConfigRepository) {

	}

}
