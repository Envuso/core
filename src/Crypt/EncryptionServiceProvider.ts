import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {Log} from "../Common";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Encryption} from "./Encryption";
import {RabbitEncryption} from "./RabbitEncryption";

export class EncryptionServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		if (!config.get('App.appKey')) {
			Log.warn('There is no app key specified in the config(Config/App.ts). Encryption will not work without this.');
			return;
		}

		//		app.container().register<SimpleCrypto>(SimpleCrypto, {
		//			useFactory : (dependencyContainer: DependencyContainer) => {
		//				return new SimpleCrypto(config.get('app.appKey'));
		//			}
		//		});

		app.container().register(Encryption, {useValue : new Encryption(config.get('App.appKey'))});
		app.container().register(RabbitEncryption, {useValue : RabbitEncryption.createInstance(config.get('App.appKey'))});
	}

	public async boot() {

	}

}
