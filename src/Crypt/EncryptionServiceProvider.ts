import SimpleCrypto from "simple-crypto-js";
import {DependencyContainer} from "tsyringe";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {App} from "../AppContainer";
import {Log} from "../Common";

export class EncryptionServiceProvider extends ServiceProvider {

	public async register(app: App, config) {
		if (!config.has('app.appKey')) {
			Log.warn('There is no app key specified in the config(Config/App.ts). Encryption will not work without this.');
			return;
		}

		app.container().register<SimpleCrypto>(SimpleCrypto, {
			useFactory : (dependencyContainer: DependencyContainer) => {
				return new SimpleCrypto(config.get('app.appKey'));
			}
		});
	}

	public async boot() {

	}

}
