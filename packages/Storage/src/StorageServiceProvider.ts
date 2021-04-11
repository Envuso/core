import {App, ConfigRepository, ServiceProvider} from "@envuso/app";
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
