import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {assertStrongAppKey} from "./AppKey";
import type {AppContract} from "../Contracts/AppContainer/AppContract";
import type {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";
import {Encryption} from "./Encryption";

export class EncryptionServiceProvider extends ServiceProvider {

	public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
		// Refuse to boot with a missing or weak key: it signs JWTs and encrypts cookies/sessions
		assertStrongAppKey(config.get('App.appKey'));


		const encryption = Encryption.use(new Encryption(config.get('App.appKey'), true));

		app.container().register(Encryption, {useValue : encryption});
	}

	public async boot() {

	}

}
