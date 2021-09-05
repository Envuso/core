import SimpleCrypto from "simple-crypto-js";
import {DependencyContainer} from "tsyringe";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {Log} from "../Common";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Encryption} from "./Encryption";

export class EncryptionServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		if (!config.get('App').has('appKey')) {
			Log.warn('There is no app key specified in the config(Config/App.ts). Encryption will not work without this.');
			return;
		}

		//		app.container().register<SimpleCrypto>(SimpleCrypto, {
		//			useFactory : (dependencyContainer: DependencyContainer) => {
		//				return new SimpleCrypto(config.get('app.appKey'));
		//			}
		//		});

		app.container().register(Encryption, {useValue : new Encryption(config.get('App').get('appKey'))});
	}

	public async boot() {

	}

}
