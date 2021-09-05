export class Maths {
	static randomInt(min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER): number {
		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

declare global {
	interface Math {
		randomInt(min?: number, max?: number): number;
	}
}

Math.randomInt = function (min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER) {
	return Maths.randomInt(min, max);
};
