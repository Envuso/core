import crypto from 'crypto';

export class CookieValuePrefix {

	public static create(name: string, key: string): string {
		const hmac = crypto.createHmac('sha1', key);

		hmac.update(name + 'envu');

		return hmac.digest('hex');
	}

	public static remove(value: string): string {
		return value.substr(40);
	}

}
