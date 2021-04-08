import {resolve} from "@Core";
import SimpleCrypto from "simple-crypto-js";

export class Encryption {

	static encrypt(content: any) {
		return resolve<SimpleCrypto>(SimpleCrypto).encrypt(content);
	}

	static decrypt(content: any) {
		return resolve<SimpleCrypto>(SimpleCrypto).decrypt(content);
	}

	static random(length?: number) {
		return SimpleCrypto.generateRandomString(length);
	}

}
