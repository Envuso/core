import {ObjectContainerConfiguration, ObjectContainerObject} from "../../Common";

export interface ObjectContainerContract<T> {
	data: ObjectContainerObject<T>;
	config: ObjectContainerConfiguration;

	/**
	 * If we wish to use keys as lower case or values as lower case.
	 * This will process our data when the class is initiated.
	 *
	 * @private
	 */
	prepareData(): void;

	/**
	 * Do we have the key in the object?
	 * We can optionally pass a value to also compare. This will check if the key exists and if it's value is x
	 *
	 * @param {string} key
	 * @return {boolean}
	 */
	has(key: string): boolean;

	/**
	 * Do we have the key in the object?
	 * We can optionally pass a value to also compare. This will check if the key exists and if it's value is x
	 *
	 * @param {string} key
	 * @param {T|undefined} value
	 * @return {boolean}
	 */
	has(key: string, value: T): boolean;

	/**
	 * Do we have the key in the object?
	 * We can optionally pass a value to also compare. This will check if the key exists and if it's value is x
	 *
	 * @param {string} key
	 * @param {T|undefined} value
	 * @return {boolean}
	 */
	has(key: string, value?: T): boolean;

	/**
	 * Get the value from the container by it's key
	 *
	 * @param {string} key
	 * @param _default
	 * @return {T}
	 */
	get(key: string, _default?: any): T;

	/**
	 * Put a value into the container, if a value with the same key already exists, it will be overwritten.
	 *
	 * @param {string} key
	 * @param value
	 * @return {ObjectContainer}
	 */
	put(key: string, value: any): ObjectContainerContract<T>;

	/**
	 * If an item exists with the same key, the value will not be added and we'll return false.
	 * If an item doesn't exist and we added the value, we'll return true.
	 *
	 * @param {string} key
	 * @param value
	 * @return {boolean}
	 */
	putIfNotExists(key: string, value: any): boolean;

	/**
	 * If an item exists by the key, remove it
	 *
	 * @param {string} key
	 * @return {ObjectContainer}
	 */
	forget(key: string): ObjectContainerContract<T>;

	/**
	 * Does the same as {@link forget}, this method just calls forget.
	 *
	 * @param {string} key
	 */
	remove(key: string): any;

	/**
	 * Remove all items from the object
	 */
	clear(): void;

	/**
	 * Get all items from the container
	 *
	 * @return {ObjectContainerObject<T>}
	 */
	items(): ObjectContainerObject<T>;

	/**
	 * Same as {@link items}, just feels more convenient to use
	 *
	 * @return {ObjectContainerObject<T>}
	 */
	all(): ObjectContainerObject<T>;

	/**
	 * Get all keys of the object
	 *
	 * @return {string[]}
	 */
	keys(): string[];

	/**
	 * Get all values, without their keys as an array
	 *
	 * @return {T[]}
	 */
	values(): T[];

	convertKey(key: string): string;

	convertValue(value: T | string): T | string;

	/**
	 * Reset the store and populate it with key->value items
	 *
	 * @param {object} values
	 *
	 * @return {ObjectContainer<T>}
	 */
	populate(values: { [key: string]: any }): ObjectContainerContract<T>;
}
