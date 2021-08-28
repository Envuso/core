export class Classes {

	/**
	 * Check if a class has been instantiated
	 *
	 * @param c
	 * @returns {boolean}
	 */
	public static isInstantiated(c: any): boolean {
		return (typeof c.prototype === "undefined");
	}

	/**
	 * If a class has been instantiated, get the underlying constructor
	 * Otherwise, return the constructor
	 *
	 * @param c
	 * @returns {boolean}
	 */
	public static getConstructor<T>(c: any): new () => T {
		if (this.isInstantiated(c)) {
			return c.constructor;
		}

		return c;
	}

}
