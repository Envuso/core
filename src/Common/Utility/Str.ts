import {isPlural, isSingular, plural, singular} from "pluralize";
import SimpleCrypto from "simple-crypto-js";
import Obj from "./Obj";


export class Str {

	/**
	 * Uses math.random() to get a quick and dirty random string
	 * Lot's quicker but cannot guarantee it's unique in the moment.
	 *
	 * Quick perf test; 1000 iterations of 100 char string in 0.46-0.47ms
	 *
	 * @param length
	 */
	static random(length = 10): string {
		const getRandom = () => Math.random().toString(20).substr(2, length);

		let currentStr = getRandom();

		if (currentStr.length <= length) {
			return currentStr.slice(0, length);
		}

		while (currentStr.length < length) {
			currentStr += getRandom();
		}

		return currentStr.slice(0, length);
	}

	/**
	 * Uses node.js crypto module to give a more unique random string
	 *
	 * Quick perf test; 1000 iterations of 100 char string in 8.93-9.23ms
	 *
	 * @param length
	 */
	static uniqueRandom(length = 10) {
		return require('crypto').randomBytes(Math.ceil(length / 2))
			.toString('hex')
			.substr(0, length);
	}

	/**
	 * Contributed by https://github.com/73cn0109y
	 * Commit was lost during mono-repo merge :(
	 */
	static isEmpty(value: any): boolean {
		return (Obj.isNullOrUndefined(value) || String(value).trim().length === 0);
	}

	static randomWords(amount: number): string[] {
		return SimpleCrypto.generateRandomWordArray(amount);
	}
}

declare global {
	interface StringConstructor {
		random(length?: number): string;
	}

	interface String {
		isEmpty(): boolean;

		contains(values: string[]): boolean;

		capitalize(): this;

		remove(subStr: string): this;

		plural(): this;

		isPlural(): boolean;

		isSingular(): boolean;

		singular(): this;

	}
}

String.random = function (length: number = 10): string {
	return Str.random(length);
};

String.prototype.isEmpty = function (): boolean {
	return Str.isEmpty(this);
};

String.prototype.contains = function (values: string[]) {
	for (let value of values) {
		if (this.includes(value)) {
			return true;
		}
	}

	return false;
};

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.remove = function (subStr: string) {
	return this.replace(subStr, '');
};

String.prototype.plural = function () {
	return plural(this);
};

String.prototype.isPlural = function (): boolean {
	return isPlural(this);
};

String.prototype.isSingular = function (): boolean {
	return isSingular(this);
};

String.prototype.singular = function () {
	return singular(this);
};
