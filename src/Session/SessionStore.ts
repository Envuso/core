import {Obj} from "../Common";
import {Arr} from "../Common/Utility/Arr";
import {SessionStoreContract} from "../Contracts/Session/SessionStoreContract";

export class SessionStore implements SessionStoreContract {

	private attributes: any = {};

	/**
	 * Get all items from the session store
	 *
	 * @return {any}
	 */
	items(): any {
		return this.attributes;
	}

	/**
	 * Get values from the store by their key
	 *
	 * @param {string[]} keys
	 * @return {Partial<T>}
	 */
	public only<T extends object>(keys: string[]): Partial<T> {
		return Obj.only<T>(this.attributes, keys);
	}

	/**
	 * Check if a key exists
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	public exists(key: string): boolean {
		return Obj.exists(this.attributes, key);
	}

	/**
	 * Check if a key exists and is not null
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	public has(key: string): boolean {
		return Obj.has(this.attributes, key);
	}

	/**
	 * The opposite of {@link exists}, check if x key does not exist
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	public missing(key: string): boolean {
		return !this.exists(key);
	}

	/**
	 * Get an item from the store
	 *
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	public get<T>(key?: string, _default: any = null): T {
		if (key === undefined) {
			return this.attributes;
		}

		return Obj.get<T>(this.attributes, key) ?? _default;
	}

	/**
	 * Get an item from the store by it's key and remove it.
	 *
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	public pull<T>(key: string, _default: any = null): T {
		const {value, updated} = Obj.pull<T, any>(this.attributes, key, _default);

		this.attributes = updated;

		return value;
	}

	/**
	 * Replace attributes in the store with the defined object
	 *
	 * @param {object} attributes
	 */
	public replace(attributes: object) {
		this.put(attributes);
	}

	/**
	 * Put an object of key -> value into the session
	 *
	 * @param {object} keyOrObject
	 */
	public put(keyOrObject: object);
	/**
	 * Put a key->value into the store
	 *
	 * @param {string} keyOrObject
	 * @param value
	 */
	public put(keyOrObject: string, value?: any);

	/**
	 * Put a key->value into the store
	 *
	 * @param {string | object} keyOrObject
	 * @param value
	 */
	public put(keyOrObject: string | object, value?: any) {
		if (typeof keyOrObject === 'string') {
			this.attributes = Obj.put(this.attributes, keyOrObject as string, value);

			return;
		}

		if (typeof keyOrObject === 'object') {
			for (let key in keyOrObject) {
				this.attributes[key] = keyOrObject[key];
			}
		}
	}

	/**
	 * If we're storing an array in the session
	 * We can push a new value onto that array.
	 *
	 * @param {string} key
	 * @param value
	 */
	public push(key: string, value: any) {
		const arr = this.get<Array<any>>(key, []);

		arr.push(value);

		this.put(key, arr);
	}

	/**
	 * If we're storing a number in the store, we can increment it by the amount
	 *
	 * @param {string} key
	 * @param {number} amount
	 * @return {number}
	 */
	public increment(key: string, amount: number = 1) {
		const value = this.get<number>(key, 0);

		const newValue = value + amount;

		this.put(key, newValue);

		return newValue;
	}

	/**
	 * If we're storing a number in the store, we can decrement it by the amount
	 *
	 * @param {string} key
	 * @param {number} amount
	 * @return {number}
	 */
	public decrement(key: string, amount: number = 1) {
		const value = this.get<number>(key, 0);

		const newValue = value - amount;

		this.put(key, newValue);

		return newValue;
	}

	/**
	 * Flash a key->value pair into the store
	 * This item will only exist for one request and not be available in the current request.
	 * So, we're adding an item into the store for the next request by the user, but only that request.
	 *
	 * Use {@link flashNow} if it needs to be accessible in the current request + next
	 *
	 * @param {string} key
	 * @param value
	 */
	public flash(key: string, value: any = null) {
		this.put(key, value);

		this.push('_flash.new', key);

		this.removeFromOldFlashData([key]);
	}

	/**
	 * Flash into the store that is immediately available in the current request
	 *
	 * @param {string} key
	 * @param value
	 */
	public flashNow(key: string, value: any) {
		this.put(key, value);

		this.push('_flash.old', key);
	}

	/**
	 * Reflash all of the session data
	 */
	public reflash() {
		this.mergeNewFlashes(this.get('_flash.old', []));

		this.put('_flash.old', []);
	}

	/**
	 * Reflash a subset of the current flash data
	 *
	 * @param {string[]} keys
	 */
	public keep(keys: string[]) {
		this.mergeNewFlashes(keys);

		this.removeFromOldFlashData(keys);
	}

	/**
	 * Flash an object(key->value) of user inputs onto the session
	 *
	 * @param {object} input
	 */
	public flashInput(input: { [key: string]: any }) {
		this.flash('_old_input', input);
	}

	/**
	 * Check if the session contains old input
	 * If key is not specified, we'll return whether an item exists with this key
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	public hasOldInput(key?: string) {
		const old = this.getOldInput<any>(key);

		return (key === undefined) ? (Obj.count(old) > 0) : (old === null);
	}

	/**
	 * Get an item from the old input values
	 *
	 * @param {string} key
	 * @param _default
	 * @return {unknown}
	 */
	public getOldInput<T extends any>(key?: string, _default: any = null): T[] {
		const oldInput = this.get('_old_input', []);

		return Obj.get<T[]>(oldInput, key, _default);
	}

	/**
	 * Remove an item from the session and return it's value
	 *
	 * @param {string} key
	 * @return {T}
	 */
	public remove<T>(key: string): T {
		const {value, updated} = Obj.pull<T, object>(this.attributes, key);

		this.attributes = updated;

		return value;
	}

	/**
	 * Remove one or many items from the store
	 *
	 * @param {string[]} keys
	 */
	public forget(keys: string[]) {
		for (let key of keys) {
			this.attributes = Obj.forget(this.attributes, key);
		}
	}

	/**
	 * Remove all items from the session
	 */
	public flush() {
		this.attributes = {};
	}

	/**
	 * Merge new flash keys into the new flash array
	 *
	 * @param {string[]} keys
	 */
	public mergeNewFlashes(keys: string[]) {
		const values = Arr.unique(
			Arr.merge(this.get<ArrayLike<any>>('_flash.new', []), keys)
		);

		this.put('_flash.new', values);
	}

	/**
	 * Age the flash data
	 * This will run every time we save the session data at the end of the request.
	 */
	public ageFlashData() {
		const oldFlashData = this.get<any[]>('_flash.old', []);
		const newFlashData = this.get<any[]>('_flash.new', []);

		this.forget(oldFlashData);

		this.put('_flash.old', newFlashData);

		this.put('_flash.new', []);
	}

	/**
	 * Remove the given keys from the old flash data
	 *
	 * @param {string[]} keys
	 */
	public removeFromOldFlashData(keys: string[]) {
		const old = this.get<any[]>('_flash.old', []);

		const oldDiff = Arr.diff(old, keys);

		this.put('_flash.old', oldDiff);
	}

	/**
	 * Flush the store and set all of the values specified
	 *
	 * @param {object} values
	 */
	public populate(values: object): void {
		this.flush();

		this.put(values);
	}

	/**
	 * Flush an input array on to the session
	 *
	 * @param {any[]} values
	 */
	public flushInput(values: any[]): void {
		this.flash('_old_input', values);
	}

	/**
	 * Set the previous request url
	 *
	 * @param {string} url
	 */
	public setPreviousUrl(url: string): void {
		this.put('_previous.url', url);
	}

	/**
	 * Get the previous request url
	 *
	 * @returns {string | null}
	 */
	public previousUrl(): string | null {
		return this.get('_previous.url');
	}
}
