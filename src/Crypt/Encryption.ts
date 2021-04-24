import SimpleCrypto from "simple-crypto-js";
import {resolve} from "../AppContainer";

export class Encryption {

	static encrypt(content: any) {
		return resolve(SimpleCrypto).encrypt(content);
	}

	static decrypt(content: any) {
		return resolve(SimpleCrypto).decrypt(content);
	}

	static random(length?: number) {
		return SimpleCrypto.generateRandomString(length);
	}

}
