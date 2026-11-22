
export interface EncryptionContract {
	key: string;

	/**
	 * Encrypt some content and returns a string
	 *
	 * @param content
	 * @returns {string}
	 */
	encrypt(content: any, context?: string): string;

	/**
	 * Decrypts some content back to it's original form
	 *
	 * @template T
	 * @param {string} content
	 * @returns {T}
	 */
	decrypt<T = any>(content: string, context?: string): T;

	tryDecrypt<T = any>(content: string, context?: string): T | null;

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
