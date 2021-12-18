export interface CsrfContract {
	saltLength: number;
	secretLength: number;

	create(secret: string): string;

	tokenize(secret: string, salt: string): string;

	/**
	 * Verify if a given token is valid for a given secret.
	 *
	 * @param {string} secret
	 * @param {string} token
	 * @public
	 */
	verify(secret: string, token: string): boolean;

	/**
	 * Hash a string with SHA1, returning url-safe base64
	 * @param {string} str
	 * @private
	 */
	hash(str: string): string;

	/**
	 * Create a new secret key.
	 *
	 * @public
	 */
	secret(): Promise<string>;
}
