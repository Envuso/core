import {Config} from "@Config";
import Container from "@Core/Container";
import {ServiceProvider} from "@Providers/ServiceProvider";
import {injectable} from "inversify";
import SimpleCrypto from "simple-crypto-js";

@injectable()
export class EncryptionServiceProvider extends ServiceProvider {

	public registerBindings() {
		const crypt = new SimpleCrypto(Config.app.appKey);

		Container.bind<SimpleCrypto>(SimpleCrypto).toConstantValue(crypt);
	}

	boot() {

	}

}
