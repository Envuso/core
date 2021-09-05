import SimpleCrypto from "simple-crypto-js";

export interface EncryptionContract {
	key: string;
	service: SimpleCrypto;

	/**
	 * Encrypt some content and returns a string
	 *
	 * @param content
	 * @returns {string}
	 */
	encrypt(content: any): string;

	/**
	 * Decrypts some content back to it's original form
	 *
	 * @param {string} content
	 * @returns {T}
	 */
	decrypt<T>(content: string): T;

	/**
	 * Generate a random string
	 *
	 * @param {number} length
	 * @returns {string}
	 */
	random(length?: number): string;

	getKey(): string;

	/**
	 * Create a new instance with a custom key
	 *
	 * @param {string} key
	 * @return {EncryptionContract}
	 */
	newInstance(key: string): EncryptionContract;
}
