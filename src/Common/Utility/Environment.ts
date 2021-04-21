

export class Environment {

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 *
	 * @returns {boolean}
	 */
	static isNode(): boolean {
		return (typeof process !== undefined &&
			typeof process.versions !== undefined &&
			typeof process.versions.node !== undefined);
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 *
	 * @returns {boolean}
	 */
	static isBrowser(): boolean {
		try {
			// @ts-ignore
			return (window !== undefined);
		} catch (error) {
		}

		return false;
	}
}

export default Environment;
