const randomBytes = require('random-bytes');

const EQUAL_END_REGEXP    = /=+$/;
const PLUS_GLOBAL_REGEXP  = /\+/g;
const SLASH_GLOBAL_REGEXP = /\//g;

export class Uid {

	/**
	 * Create a unique ID.
	 *
	 * @param {number} length
	 * @return {Promise}
	 * @public
	 */
	public static generate(length: number): Promise<string> {
		return new Promise((resolve, reject) => {
			this.generateUid(length, (err, str) => {
				if (err) {
					return reject(err);
				}
				resolve(str);
			});
		});
	}

	/**
	 * Generate a unique ID string.
	 *
	 * @param {number} length
	 * @param {function} callback
	 * @private
	 */
	public static generateUid(length, callback) {
		randomBytes(length, (err, buf) => {
			if (err) {
				return callback(err);
			}

			callback(null, Uid.uidToString(buf));
		});
	}

	/**
	 * Change a Buffer into a string.
	 *
	 * @param {Buffer} buf
	 * @return {string}
	 * @private
	 */
	private static uidToString(buf) {
		return buf.toString('base64')
			.replace(EQUAL_END_REGEXP, '')
			.replace(PLUS_GLOBAL_REGEXP, '-')
			.replace(SLASH_GLOBAL_REGEXP, '_');
	}
}
