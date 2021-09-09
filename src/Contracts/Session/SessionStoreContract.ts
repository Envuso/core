export interface SessionStoreContract {

	/**
	 * Get all items from the session store
	 *
	 * @return {any}
	 */
	items(): any;

	/**
	 * Get values from the store by their key
	 *
	 * @template T
	 * @param {string[]} keys
	 * @return {Partial<T>}
	 */
	only<T extends object>(keys: string[]): Partial<T>;

	/**
	 * Check if a key exists
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	exists(key: string): boolean;

	/**
	 * Check if a key exists and is not null
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	has(key: string): boolean;

	/**
	 * The opposite of {@link exists}, check if x key does not exist
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	missing(key: string): boolean;

	/**
	 * Get an item from the store
	 *
	 * @template T
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	get<T>(key?: string, _default?: any): T;

	/**
	 * Get an item from the store by it's key and remove it.
	 *
	 * @template T
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	pull<T>(key: string, _default?: any): T;

	/**
	 * Replace attributes in the store with the defined object
	 *
	 * @param {object} attributes
	 */
	replace(attributes: object): void;

	/**
	 * Put an object of key -> value into the session
	 *
	 * @param {object} keyOrObject
	 */
	put(keyOrObject: object): any;

	/**
	 * Put a key->value into the store
	 *
	 * @param {string} keyOrObject
	 * @param value
	 */
	put(keyOrObject: string, value?: any): any;

	/**
	 * Put a key->value into the store
	 *
	 * @param {string | object} keyOrObject
	 * @param value
	 */
	put(keyOrObject: string | object, value?: any): void;

	/**
	 * If we're storing an array in the session
	 * We can push a new value onto that array.
	 *
	 * @param {string} key
	 * @param value
	 */
	push(key: string, value: any): void;

	/**
	 * If we're storing a number in the store, we can increment it by the amount
	 *
	 * @param {string} key
	 * @param {number} amount
	 * @return {number}
	 */
	increment(key: string, amount: number): any;

	/**
	 * If we're storing a number in the store, we can decrement it by the amount
	 *
	 * @param {string} key
	 * @param {number} amount
	 * @return {number}
	 */
	decrement(key: string, amount: number): number;

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
	flash(key: string, value: any): void;

	/**
	 * Flash into the store that is immediately available in the current request
	 *
	 * @param {string} key
	 * @param value
	 */
	flashNow(key: string, value: any): void;

	/**
	 * Reflash all of the session data
	 */
	reflash(): void;

	/**
	 * Reflash a subset of the current flash data
	 *
	 * @param {string[]} keys
	 */
	keep(keys: string[]): void;

	/**
	 * Flash an object(key->value) of user inputs onto the session
	 *
	 * @param {object} input
	 */
	flashInput(input: { [key: string]: any }): void;

	/**
	 * Check if the session contains old input
	 * If key is not specified, we'll return whether an item exists with this key
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	hasOldInput(key?: string): boolean;

	/**
	 * Get an item from the old input values
	 *
	 * @template T
	 * @param {string} key
	 * @param _default
	 * @return {T[]}
	 */
	getOldInput<T extends any>(key?: string, _default?: any): T[];

	/**
	 * Remove an item from the session and return it's value
	 *
	 * @template T
	 * @param {string} key
	 * @return {T}
	 */
	remove<T>(key: string): T;

	/**
	 * Remove one or many items from the store
	 *
	 * @param {string[]} keys
	 */
	forget(keys: string[]): void;

	/**
	 * Remove all items from the session
	 */
	flush(): void;

	/**
	 * Merge new flash keys into the new flash array
	 *
	 * @param {string[]} keys
	 */
	mergeNewFlashes(keys: string[]): void;

	/**
	 * Age the flash data
	 * This will run every time we save the session data at the end of the request.
	 */
	ageFlashData(): void;

	/**
	 * Remove the given keys from the old flash data
	 *
	 * @param {string[]} keys
	 */
	removeFromOldFlashData(keys: string[]): void;

	/**
	 * Flush the store and set all of the values specified
	 *
	 * @param {object} values
	 */
	populate(values: object);

	/**
	 * Flush an input array on to the session
	 *
	 * @param {any[]} values
	 */
	flushInput(values: any[]): void;
}
