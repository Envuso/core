import SimpleCrypto from "simple-crypto-js";
import {resolve} from "../AppContainer";

export class Encryption {

	/**
	 * Encrypt some content and returns a string
	 *
	 * @param content
	 * @returns {string}
	 */
	static encrypt(content: any): string {
		return resolve(SimpleCrypto).encrypt(content);
	}

	/**
	 * Decrypts some content back to it's original form
	 *
	 * @param {string} content
	 * @returns {T}
	 */
	static decrypt<T>(content: string): T {
		return resolve(SimpleCrypto).decrypt(content) as unknown as T;
	}

	/**
	 * Generate a random string
	 *
	 * @param {number} length
	 * @returns {string}
	 */
	static random(length?: number): string {
		return SimpleCrypto.generateRandomString(length);
	}

}
