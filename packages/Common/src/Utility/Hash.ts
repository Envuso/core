import bcrypt from "bcrypt";

export class Hash {

	/**
	 * Make a hash of the content
	 *
	 * @param content
	 * @param rounds
	 */
	static make(content: string, rounds: number = 10): Promise<string> {
		return bcrypt.hash(content, 10);
	}

	/**
	 * Check if the content matches the hashed content
	 *
	 * @param content
	 * @param hashedContent
	 */
	static check(content: string, hashedContent: string): boolean {
		return bcrypt.compareSync(content, hashedContent)
	}

}
