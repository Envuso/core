import {App, DependencyContainer, ServiceProvider} from "@envuso/app";
import {Log} from "@envuso/common";
import SimpleCrypto from "simple-crypto-js";

export class EncryptionServiceProvider extends ServiceProvider {

	public async register(app: App, config) {
		if (!config.has('app.appKey')) {
			Log.warn('There is no app key specified in the config(Config/App.ts). Encryption will not work without this.');
			return;
		}

		app.container().register<SimpleCrypto>(SimpleCrypto, {
			useFactory : (dependencyContainer: DependencyContainer) => {
				return new SimpleCrypto(config.get('app.appKey'))
			}
		});

	}

	public async boot() {

	}

}
