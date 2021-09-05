import difference from "lodash.difference";
import uniq from "lodash.uniq";
import merge from "lodash.merge";
import {Maths} from "./Maths";


export class Arr {

	/**
	 * Get the first item from the array
	 *
	 * @param {T[]} array
	 * @return {T}
	 */
	public static first<T>(array: T[]): T {
		if (!array?.length) {
			return null;
		}

		return array[0];
	}

	/**
	 * Get the last item from the array
	 *
	 * @param {T[]} array
	 * @return {T}
	 */
	public static last<T>(array: T[]): T {
		if (!array?.length) {
			return null;
		}

		return array[array.length - 1] ?? null;
	}

	/**
	 * Return a new array of items that are not included in arrayTwo, but exist in arrayOne
	 * For ex;
	 * arrayOne = [1, 2], arrayTwo = [2, 3];
	 * returns [1];
	 *
	 * Because 2 exists in arrayTwo, but 1 does not.
	 *
	 * @param {array} arrayOne
	 * @param {array} arrayTwo
	 *
	 * @return {array}
	 */
	public static diff<T extends ArrayLike<any>>(arrayOne: ArrayLike<any>, arrayTwo: ArrayLike<any>): T {
		return difference(arrayOne, arrayTwo);
	}

	/**
	 * Creates an array excluding any duplicates
	 *
	 * @param {ArrayLike<any>} array
	 * @return {ArrayLike<any>}
	 */
	public static unique<T extends ArrayLike<any>>(array: ArrayLike<any>): T {
		return uniq(array);
	}

	/**
	 * Merge two arrays
	 *
	 * @param {array} arrayOne
	 * @param {array} arrayTwo
	 *
	 * @return {array}
	 */
	public static merge<T extends ArrayLike<any>, TT extends ArrayLike<any>>(
		arrayOne: T, arrayTwo: TT
	): ArrayLike<any> {
		return merge(arrayOne, arrayTwo);
	}

	public static contains(arr: any[], item: any): boolean {
		return arr.includes(item);
	};

	public static has(arr: any[], ...item: any[]): boolean {
		for (let itemElement of item) {
			if (!arr.includes(itemElement)) {
				return false;
			}
		}

		return true;
	};

}

//declare global {
//	interface Array<T> {
//
//		isEmpty(): boolean;
//
//		contains(item: any): boolean;
//
//		has(...items: any[]): boolean;
//
//		random(): T;
//
//		first(): T;
//
//		last(): T;
//	}
//}

//
//Array.prototype.first = function <T>(): T {
//	return Arr.first<T>(this);
//};
//
//Array.prototype.last = function <T>(): T {
//	return Arr.last<T>(this);
//};
//
//Array.prototype.isEmpty = function (): boolean {
//	return this.length === 0;
//};
//
//Array.prototype.contains = function (item: any): boolean {
//	return Arr.contains(this, item);
//};
//
//Array.prototype.has = function (...items: any[]): boolean {
//	return Arr.has(this, ...items);
//};
//
//Array.prototype.random = function () {
//	return this[Maths.randomInt(0, this.length - 1)];
//};
