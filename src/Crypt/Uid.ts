import crypto from "crypto";

export class Uid {

	/**
	 * Create a random, url-safe id from `length` random bytes
	 *
	 * @param {number} length
	 * @return {Promise<string>}
	 */
	public static async generate(length: number): Promise<string> {
		return Uid.generateSync(length);
	}

	public static generateSync(length: number): string {
		return crypto.randomBytes(length).toString('base64url');
	}

	/**
	 * @deprecated use generate()
	 */
	public static generateUid(length: number, callback: (error: Error | null, uid?: string) => void) {
		try {
			callback(null, Uid.generateSync(length));
		} catch (error) {
			callback(error as Error);
		}
	}
}
