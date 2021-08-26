import {App} from "../AppContainer/App";
import {ConfigRepository} from "../AppContainer/Config/ConfigRepository";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {StorageConfiguration} from "../Config/Storage";
import {Storage} from "./Storage";

export class StorageServiceProvider extends ServiceProvider {

	public async register(app: App, config: ConfigRepository) {
		app.container().register(Storage, {
			useFactory : () => {
				return new Storage(config.get<StorageConfiguration>('storage'));
			}
		})
	}

	public async boot(app: App, config: ConfigRepository) {

	}

}
