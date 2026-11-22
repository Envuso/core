import crypto from "crypto";

/**
 * Constant-time comparison of two buffers of the same length
 */
const bufferEqual = (a: Buffer, b: Buffer): boolean => {
	return a.length === b.length && crypto.timingSafeEqual(a, b);
};

/**
 * Constant-time string comparison.
 *
 * Both values are HMACed with a random key first (Brad Hill's double HMAC pattern),
 * so the comparison doesn't reveal their length either.
 */
const timeSafeCompare = (a: unknown, b: unknown): boolean => {
	const key = crypto.randomBytes(32);
	const ah  = crypto.createHmac('sha256', key).update(String(a)).digest();
	const bh  = crypto.createHmac('sha256', key).update(String(b)).digest();

	return crypto.timingSafeEqual(ah, bh);
};

export {bufferEqual, timeSafeCompare};
