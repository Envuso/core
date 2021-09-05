const base62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const base36 = 'abcdefghijklmnopqrstuvwxyz0123456789';
const base10 = '0123456789';

export const csrfRandom = (charLength: number): string => {
	return getRandomBase(base62, charLength);
};

export const csrfRandom36 = (charLength: number): string => {
	return getRandomBase(base36, charLength);
};

export const csrfRandom10 = (charLength: number): string => {
	return getRandomBase(base10, charLength);
};

const getRandomBase = (chars, returnLength) => {
	let length  = Buffer.byteLength(chars);

	let salt = '';
	for (let i = 0; i < returnLength; i++) {
		salt += chars[Math.floor(length * Math.random())];
	}

	return salt;
}
