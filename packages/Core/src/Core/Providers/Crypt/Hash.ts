import bcrypt from "bcrypt";

export class Hash {

	static make(content: string, rounds: number = 10): Promise<string> {
		return bcrypt.hash(content, 10);
	}

	static check(content: string, hashedContent: string): boolean {
		return bcrypt.compareSync(content, hashedContent)
	}

}
