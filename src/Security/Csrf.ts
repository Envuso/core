import crypto from 'crypto';
import {CsrfContract} from "../Contracts/Security/CsrfContract";
import {timeSafeCompare, Uid} from "../Crypt";
import {csrfRandom} from "./CsrfRandom";


export type CsrfOptions = {
	saltLength: number;
	secretLength: number;
}

const EQUAL_GLOBAL_REGEXP = /=/g;
const PLUS_GLOBAL_REGEXP  = /\+/g;
const SLASH_GLOBAL_REGEXP = /\//g;

export class Csrf implements CsrfContract {

	public saltLength: number = 8;
	public secretLength: number = 18;

	constructor(options?: CsrfOptions) {
		if(options !== undefined) {
			if (typeof options.saltLength !== 'number' || !isFinite(options.saltLength) || options.saltLength < 1) {
				throw new TypeError('option saltLength must be finite number > 1');
			}

			if (typeof options.secretLength !== 'number' || !isFinite(options.secretLength) || options.secretLength < 1) {
				throw new TypeError('option secretLength must be finite number > 1');
			}

			this.saltLength   = options.saltLength;
			this.secretLength = options.secretLength;
		}
	}

	public create(secret: string): string {
		if (!secret || typeof secret !== 'string') {
			throw new TypeError('argument secret is required');
		}

		return this.tokenize(secret, csrfRandom(this.saltLength));
	}

	public tokenize(secret: string, salt: string) {
		return salt + '-' + this.hash(salt + '-' + secret);
	}

	/**
	 * Verify if a given token is valid for a given secret.
	 *
	 * @param {string} secret
	 * @param {string} token
	 * @public
	 */
	public verify(secret: string, token: string): boolean {
		if (!secret || typeof secret !== 'string') {
			return false;
		}

		if (!token || typeof token !== 'string') {
			return false;
		}

		const index = token.indexOf('-');

		if (index === -1) {
			return false;
		}

		const salt     = token.substr(0, index);
		const expected = this.tokenize(secret, salt);

		return timeSafeCompare(token, expected);
	}

	/**
	 * Hash a string with SHA1, returning url-safe base64
	 * @param {string} str
	 * @private
	 */
	public hash(str: string): string {
		return crypto
			.createHash('sha1')
			.update(str, 'ascii')
			.digest('base64')
			.replace(PLUS_GLOBAL_REGEXP, '-')
			.replace(SLASH_GLOBAL_REGEXP, '_')
			.replace(EQUAL_GLOBAL_REGEXP, '');
	}

	/**
	 * Create a new secret key.
	 *
	 * @public
	 */
	public secret(): Promise<string> {
		return Uid.generate(this.secretLength);
	}


}
