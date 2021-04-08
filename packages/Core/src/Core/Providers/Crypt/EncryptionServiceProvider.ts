import {Config} from "@Config";
import {injectable} from "inversify";
import SimpleCrypto from "simple-crypto-js";
import {Container, ServiceProvider} from "@Core";

@injectable()
export class EncryptionServiceProvider extends ServiceProvider {

	public registerBindings() {
		const crypt = new SimpleCrypto(Config.app.appKey);

		Container.bind<SimpleCrypto>(SimpleCrypto).toConstantValue(crypt);
	}

	boot() {

	}

}
