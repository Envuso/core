import get from "lodash.get";
import unset from "lodash.unset";
import pick from "lodash.pick";

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
	public static has(obj: any, property: any, includePropertyChain: boolean = false): boolean {
		if (Obj.isNullOrUndefined(obj)) {
			return false;
		}

		if (includePropertyChain && typeof obj === 'object') {
			return (property in obj);
		}

		return Object.prototype.hasOwnProperty.call(obj, property);
	}

	/**
	 * Check if a key exists on an object
	 *
	 * @param obj
	 * @param property
	 * @return {boolean}
	 */
	public static exists(obj: any, property: any): boolean {
		return obj[property] !== undefined;
	}

	/**
	 * Put a new key->value into the object
	 *
	 * @param {T} obj
	 * @param {string} key
	 * @param value
	 * @return {T}
	 */
	public static put<T extends object>(obj: T, key: string, value: any): T {
		if (this.isNullOrUndefined(obj)) {
			obj = {} as T;
		}

		obj[key] = value;

		return obj;
	}

	/**
	 * Get an item from the object, if it doesn't exist, return _default
	 *
	 * @param obj
	 * @param {string} key
	 * @param _default
	 * @return {V}
	 */
	public static get<V>(obj: any, key?: string, _default: any = null): V {
		if (key === undefined) {
			return (obj === undefined ? _default : obj);
		}
		return get(obj, key) ?? _default;
	}

	/**
	 * Return a new object containing only the specified keys
	 *
	 * @param {T} obj
	 * @param {string[]} keys
	 * @return {Partial<T>}
	 */
	public static only<T extends object>(obj: T, keys: string[]): Partial<T> {
		return pick(obj, keys);
	}

	/**
	 * Return a new object without the items specified by the keys
	 *
	 * @param {T} obj
	 * @param {string[]} keys
	 * @return {Partial<T>}
	 */
	public static except<T extends object>(obj: T, keys: string[]): Partial<T> {
		const values: Partial<T> = {};

		for (let key in obj) {
			if (keys.includes(key)) {
				continue;
			}

			values[key] = obj[key];
		}

		return values;
	}

	/**
	 * Get the keys from the object
	 *
	 * @param {object} obj
	 * @return {(string | number)[]}
	 */
	public static keys(obj: object): (string | number)[] {
		return Object.keys(obj);
	}

	/**
	 * Remove an item from the object and return the updated object
	 *
	 * @param {T} obj
	 * @param {string} key
	 * @return {Partial<T>}
	 */
	public static forget<T>(obj: T, key: string): Partial<T> {
		if (!this.has(obj, key)) {
			return obj;
		}

		unset(obj, key);

		return obj;
	}

	/**
	 * Get an item from the object, remove it, then return the item & the updated array
	 *
	 * @param {O} obj
	 * @param {string} key
	 * @param _default
	 * @return {{value: T, updated: Partial<O>}}
	 */
	public static pull<T, O extends object>(obj: O, key: string, _default: any = null): { value: T, updated: Partial<O> } {
		const value = this.get<T>(obj, key) ?? _default;

		const updated = Obj.forget(obj, key);

		return {value, updated};
	}

	/**
	 * Return the count of the keys in the object
	 *
	 * @param {T} obj
	 * @return {number}
	 */
	public static count<T extends object>(obj: T): number {
		return Object.keys(obj).length;
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 */
	static toBoolean(value: any, convertNumbers = false): boolean | null {
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

	static isBoolean(value: any): boolean | null {
		if (typeof value === 'boolean') {
			return value;
		}

		if (typeof value === 'string') {
			value = value.trim().toLowerCase();
		}

		if (value === 'true' || value === 'false') {
			return true;
		}

		return false;
	}

}

export default Obj;
