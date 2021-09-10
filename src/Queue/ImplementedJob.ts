import {resolve} from "../AppContainer";
import {Encryption} from "../Crypt";
import {Job} from "./Job";
import {Queueable} from "./Queueable";
import {job} from "./JobDecorators";

@job
export class ImplementedJob extends Job implements Queueable {
	constructor(public userId: number, public isAdmin: boolean = false) {
		super();
	}

	async handle() {
		const regularEncryption = resolve(Encryption);
//		console.time("SimpleCrypto");
		for (let i = 0; i < 100; i++) {
			const encrypted = regularEncryption.encrypt('hello world');
			const decrypted = regularEncryption.decrypt(encrypted);
		}
		//		console.timeEnd("SimpleCrypto");
	}
}
