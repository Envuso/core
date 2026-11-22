export class Hash {

	/**
	 * Make a hash of the content (bcrypt, via Bun.password)
	 *
	 * @param content
	 * @param rounds bcrypt cost factor
	 */
	static make(content: string, rounds: number = 10): Promise<string> {
		return Bun.password.hash(content, {algorithm : "bcrypt", cost : rounds});
	}

	/**
	 * Check if the content matches the hashed content.
	 * The algorithm is read from the hash itself, so existing bcrypt hashes
	 * (including ones made by the old `bcrypt` npm package) keep working.
	 *
	 * @param content
	 * @param hashedContent
	 */
	static check(content: string, hashedContent: string): boolean {
		if (!content || !hashedContent) {
			return false;
		}

		return Bun.password.verifySync(content, hashedContent);
	}

}
