import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {assertStrongAppKey} from "./AppKey";
import type {AppContract} from "../Contracts/AppContainer/AppContract";
import type {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Encryption} from "./Encryption";
import {RabbitEncryption} from "./RabbitEncryption";

export class EncryptionServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		// Refuse to boot with a missing or weak key: it signs JWTs and encrypts cookies/sessions
		assertStrongAppKey(config.get('App.appKey'));

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
