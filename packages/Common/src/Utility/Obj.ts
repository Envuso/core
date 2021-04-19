export class Obj {

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 */
	static isNullOrUndefined(value: any): boolean {
		return (value === undefined || value === null);
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 */
	static isEmpty(value: any): boolean {
		return (Obj.isNullOrUndefined(value) ||
			(typeof value === 'string' && value.length === 0) ||
			(typeof value === 'number' && (isNaN(value) || value === 0)) ||
			(Array.isArray(value) && value.length === 0)
		);
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 */
	static isNumber(value: any, tryCast: boolean = true): boolean {
		if (typeof value === 'number') {
			return true;
		}

		if (Obj.isNullOrUndefined(value) || !tryCast) {
			return false;
		}

		return !isNaN(+value);
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 */
	static has(obj: any, property: any, includePropertyChain: boolean = false): boolean {
		if (Obj.isNullOrUndefined(obj)) {
			return false;
		}

		if (includePropertyChain && typeof obj === 'object') {
			return (property in obj);
		}

		return Object.prototype.hasOwnProperty.call(obj, property);
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 */
	static toBoolean(value: any): boolean | null {
		if (typeof value === 'boolean') {
			return value;
		}

		if (typeof value === 'string') {
			value = value.trim().toLowerCase();
		}

		if (value === 1 || value === '1' || value === 'true' || value === 'yes' || value === 'on') {
			return true;
		}

		if (value === 0 || value === '0' || value === 'false' || value === 'no' || value === 'off') {
			return false;
		}

		return null;
	}
}

export default Obj;
