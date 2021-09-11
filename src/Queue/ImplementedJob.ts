import {resolve} from "../AppContainer";
import {Encryption} from "../Crypt";
import {Job} from "./Jobs/Job";
import {Queueable} from "./Jobs/Queueable";
import {job} from "./Jobs/JobDecorators";

@job
export class ImplementedJob extends Job implements Queueable {
	retries = 3;

	constructor(public userId: number, public isAdmin: boolean = false) {
		super();
	}

	async handle() {
		//		throw new Error('Whoops');

		const regularEncryption = resolve(Encryption);
		//		console.time("SimpleCrypto");
		for (let i = 0; i < 100; i++) {
			const encrypted = regularEncryption.encrypt('hello world');
			const decrypted = regularEncryption.decrypt(encrypted);
		}
		//		console.timeEnd("SimpleCrypto");
	}

	//	public async handleException(error: Error): Promise<any> {
	//		console.log("I'm handling this exception :)");
	//	}
}
