import {Rabbit} from 'crypto-js';
import {EncryptionContract} from "../Contracts/Crypt/EncryptionContract";

let instance: RabbitEncryption = null;

export class RabbitEncryption implements EncryptionContract {

	public key: string;

	constructor(key: string) {
		this.key = key;
	}

	/**
	 * Encrypt some content and returns a string
	 *
	 * @param content
	 * @returns {string}
	 */
	public encrypt(content: string): string {
		const encrypted = Rabbit.encrypt(content, this.key);

		return encrypted.toString();
	}

	/**
	 * Encrypt some content and returns a string
	 *
	 * @param content
	 * @returns {string}
	 */
	public static encrypt(content: any): string {
		return RabbitEncryption.getInstance().encrypt(content);
	}

	/**
	 * Decrypts some content back to it's original form
	 *
	 * @param {string} content
	 * @returns {T}
	 */
	public decrypt<T extends string>(content: string): T {
		const cipher = Rabbit.decrypt(content, this.key);
		return this.cipherToString(cipher.toString()) as T;
	}

	private cipherToString(cipher: string): string {
		const chars        = [];
		const decryptedArr = cipher.split('');

		while (decryptedArr.length !== 0) {
			chars.push(String.fromCharCode(parseInt(decryptedArr.splice(0, 2).join(''), 16)));
		}

		return chars.join('');
	}

	/**
	 * Decrypts some content back to it's original form
	 *
	 * @param {string} content
	 * @returns {T}
	 */
	public static decrypt<T extends string>(content: string): T {
		return RabbitEncryption.getInstance().decrypt(content);
	}

	/**
	 * Generate a random string
	 *
	 * @param {number} length
	 * @returns {string}
	 */
	public random(length?: number): string {
		return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Utf8);
	}

	/**
	 * Generate a random string
	 *
	 * @param {number} length
	 * @returns {string}
	 */
	public static random(length?: number): string {
		return RabbitEncryption.getInstance().random(length);
	}

	public static getKey(): string {
		return RabbitEncryption.getInstance().getKey();
	}

	public getKey(): string {
		return this.key;
	}

	/**
	 * Create a new instance with a custom key
	 *
	 * @param {string} key
	 * @return {EncryptionContract}
	 */
	public newInstance(key: string): EncryptionContract {
		return new RabbitEncryption(key);
	}

	public static createInstance(key: string): EncryptionContract {
		if (instance) {
			return instance;
		}

		instance = new this(key);

		return instance;
	}

	public static getInstance(): RabbitEncryption {
		return instance;
	}

}
