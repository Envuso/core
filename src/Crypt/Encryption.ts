import SimpleCrypto from "simple-crypto-js";
import {EncryptionContract} from "../Contracts/Crypt/EncryptionContract";

export class Encryption implements EncryptionContract {
	private static instance: Encryption = null;

	public key: string;

	private service: SimpleCrypto;

	constructor(key: string, customInstance: boolean = false) {
		if (!customInstance) {
			if (Encryption.instance) {
				return Encryption.instance;
			}
		}

		this.key     = key;
		this.service = new SimpleCrypto(key);

		if (!customInstance) {
			Encryption.instance = this;

			return Encryption.instance;
		}

		return this;
	}

	/**
	 * Encrypt some content and returns a string
	 *
	 * @param content
	 * @returns {string}
	 */
	public encrypt(content: any): string {
		return this.service.encrypt(content);
	}

	/**
	 * Encrypt some content and returns a string
	 *
	 * @param content
	 * @returns {string}
	 */
	public static encrypt(content: any): string {
		return Encryption.instance.encrypt(content);
	}

	/**
	 * Decrypts some content back to it's original form
	 *
	 * @param {string} content
	 * @returns {T}
	 */
	public decrypt<T>(content: string): T {
		return this.service.decrypt(content) as unknown as T;
	}

	/**
	 * Decrypts some content back to it's original form
	 *
	 * @param {string} content
	 * @returns {T}
	 */
	public static decrypt<T>(content: string): T {
		return Encryption.instance.decrypt(content);
	}

	/**
	 * Generate a random string
	 *
	 * @param {number} length
	 * @returns {string}
	 */
	public random(length?: number): string {
		return SimpleCrypto.generateRandomString(length);
	}

	/**
	 * Generate a random string
	 *
	 * @param {number} length
	 * @returns {string}
	 */
	public static random(length?: number): string {
		return Encryption.instance.random(length);
	}

	public static getKey(): string {return Encryption.instance.key;}

	public getKey(): string {
		return this.key;
	}

	/**
	 * Create a new instance with a custom key
	 *
	 * @param {string} key
	 * @return {Encryption}
	 */
	public newInstance(key: string): EncryptionContract {
		return new Encryption(key);
	}

}
