import {config} from "../AppContainer";
import {DateTime} from "../Common";
import {DateTimeContract} from "../Contracts/Common/Utility/DateTimeContract";
import {CookieContract} from "../Contracts/Cookies/CookieContract";
import {CookieConfiguration, CookieSameSiteValue} from "../Contracts/Session/Types";

const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

export class Cookie<T> implements CookieContract<T> {

	private static defaultCookieSettings: CookieConfiguration = null;

	public name: string = "";
	public value: T | string = "";

	public maxAge: DateTime = null;
	public domain: string = null;
	public path: string = null;
	public expires: DateTime = null;
	public httpOnly: boolean = null;
	public secure: boolean = null;
	public sameSite: CookieSameSiteValue = null;
	public signed: boolean = false;

	static create<V>(name: string, value: V, signed: boolean = false): CookieContract<V> {
		Cookie.setDefaultSettings();

		const cookie = new Cookie<V>();
		cookie.setDefaultCookieSettings();
		cookie.signCookie(signed);
		cookie.withName(name);
		cookie.withValue(value);

		return cookie;
	}


	private static createFromHeader(name: string, value: any): Cookie<any> {
		return Cookie.create<string>(name, value.toString());
	}

	public isValid(value: any): boolean {
		return fieldContentRegExp.test(value.toString());
	}

	private static setDefaultSettings() {
		if (!Cookie.defaultCookieSettings) {
			Cookie.defaultCookieSettings = config().get<string, any>("Session.cookie");
		}
	}

	/**
	 * Set the default cookie configuration settings from our config
	 */
	public setDefaultCookieSettings() {
		for (let key in Cookie.defaultCookieSettings) {
			this[key] = Cookie.defaultCookieSettings[key];
		}

		if (!Cookie.defaultCookieSettings.signedCookiePrefix) {
			Cookie.defaultCookieSettings.signedCookiePrefix = 'scdv:';
		}
	}

	/**
	 * Parse the cookie settings and create a string which can be set on the response header.
	 *
	 * @return {string}
	 */
	public toHeaderString() {
//		let str = this.name + '=' + this.getSignedValueOrRegular();
		let value = this.value;

//		if(this.isSigned()) {
//			value = RabbitEncryption.encrypt(value);
//		}

		let str = this.name + '=' + value;

		if (this.maxAge !== null) {
			const maxAge = this.maxAge.diffInSeconds(DateTime.now());

			if (isNaN(maxAge) || !isFinite(maxAge)) {
				throw new TypeError('option maxAge is invalid');
			}

			str += '; Max-Age=' + Math.floor(maxAge);
		}

		if (this.domain) {
			if (!fieldContentRegExp.test(this.domain)) {
				throw new TypeError('option domain is invalid');
			}

			str += '; Domain=' + this.domain;
		}

		if (this.path) {
			if (!fieldContentRegExp.test(this.path)) {
				throw new TypeError('option path is invalid');
			}

			str += '; Path=' + this.path;
		}

		if (this.expires) {
			const expires = this.expires.toDate();

			str += '; Expires=' + expires.toUTCString();
		}

		if (this.httpOnly) {
			str += '; HttpOnly';
		}

		if (this.secure) {
			str += '; Secure';
		}

		if (this.sameSite) {
			if (!["Strict", "Lax", "None"].includes(this.sameSite)) {
				throw new TypeError('Invalid same site value');
			}

			switch (this.sameSite) {
				case "Strict":
					str += '; SameSite=Strict';
					break;
				case "Lax":
					str += '; SameSite=Lax';
					break;
				case "None":
					str += '; SameSite=None';
					break;
				default:
					throw new TypeError('option sameSite is invalid');
			}
		}

		return str;
	}

//	public signCookieValue(value: string): string {
//		return value + '.' + crypto
//			.createHmac('sha256', config('app.appKey'))
//			.update(value)
//			.digest('base64')
//			.replace(/\=+$/, '');
//	}

	/**
	 * If we're using cookie signing, this will return the signed cookie value.
	 * Otherwise, it will return the regular value
	 *
	 * @return {string}
	 */
//	public getSignedValueOrRegular(): string {
//		if (this.isSigned()) {
//			return Cookie.setSignedCookiePrefix(
//				this.signCookieValue(this.value.toString())
//			);
//		}
//
//		return String(this.value);
//	}

	/**
	 * If we're using cookie signing, we'll attempt to get the underlying value
	 *
	 * If the value is no longer "safe", we'll return null instead.
	 *
	 * @return {string | null}
	 */
//	public getUnsignedValue(): string | null {
//		let value = String(this.value);
//
//		if (Cookie.containsSignedCookiePrefix(value)) {
//			value = Cookie.removeSignedCookiePrefix(value);
//		}
//
//		let str       = value.slice(0, value.lastIndexOf('.'));
//		let mac       = this.signCookieValue(str);
//		let macBuffer = Buffer.from(mac);
//		let valBuffer = Buffer.alloc(macBuffer.length);
//
//		valBuffer.write(value);
//
//		if (crypto.timingSafeEqual(macBuffer, valBuffer)) {
//			return str;
//		}
//
//		return null;
//	}

	/**
	 * Parse all of our cookies into cookie class instances from our cookie header.
	 *
	 * @param {string} cookieString
	 * @return {Cookie[]}
	 */
	static fromHeader(cookieString: string): Cookie<any>[] {
		const cookies: { [key: string]: Cookie<any> } = {};

		const pairs = cookieString.split(/; */);

		for (let i = 0; i < pairs.length; i++) {
			let pair   = pairs[i];
			let eq_idx = pair.indexOf('=');

			// skip things that don't look like key=value
			if (eq_idx < 0) {
				continue;
			}

			let key = pair.substr(0, eq_idx).trim();
			let val = pair.substr(++eq_idx, pair.length).trim();

			// quoted values
			if (val[0] == '"') {
				val = val.slice(1, -1);
			}

			if (cookies[key] === undefined) {
				cookies[key] = Cookie.createFromHeader(key, decodeURIComponent(val));
			}

		}

		return Object.values(cookies);
	}

	public getName(): string {
		return this.name;
	}

	public withName(value: string): CookieContract<T> {
		if (!this.isValid(value)) {
			throw new TypeError('Cookie name is not a valid name.');
		}

		this.name = value;

		return this;
	}

	public getValue(): T | string {
		return this.value;
	}

	public withValue(value: T): CookieContract<T> {
		if (!this.isValid(value)) {
			throw new TypeError('Cookie value is not a valid value.');
		}

		this.value = value;

//		if (Cookie.containsSignedCookiePrefix(this.value.toString())) {
//			this.signCookie();
//		}

		return this;
	}

	public withMaxAge(value: DateTime): CookieContract<T> {
		this.maxAge = value;

		return this;
	}

	public getMaxAge(): DateTimeContract {
		return this.maxAge;
	}

	public withDomain(value: string): CookieContract<T> {
		this.domain = value;

		return this;
	}

	public getDomain(): string {
		return this.domain;
	}

	public withPath(value: string): CookieContract<T> {
		this.path = value;

		return this;
	}

	public getPath(): string {
		return this.path;
	}

	public withExpiresAt(value: DateTime): CookieContract<T> {
		this.expires = value;

		return this;
	}

	public getExpires(): DateTimeContract {
		return this.expires;
	}

	public withHttpOnly(value: boolean = true): CookieContract<T> {
		this.httpOnly = value;

		return this;
	}

	public isHttpOnly(): boolean {
		return this.httpOnly;
	}

	public withSecure(value: boolean = true): CookieContract<T> {
		this.secure = value;

		return this;
	}

	public getSecure(): boolean {
		return this.secure;
	}

	public withSameSite(value: CookieSameSiteValue): CookieContract<T> {
		this.sameSite = value;

		return this;
	}

	public getSameSite(): CookieSameSiteValue {
		return this.sameSite;
	}

	public signCookie(value: boolean = true): CookieContract<T> {
		this.signed = value;

		return this;
	}

	public isSigned(): boolean {
		return this.signed;
	}

	private static getSignedCookiePrefix(): string {
		return Cookie.defaultCookieSettings.signedCookiePrefix;
	}

	private static containsSignedCookiePrefix(value: string): boolean {
		return value.startsWith(this.getSignedCookiePrefix());
	}

	private static removeSignedCookiePrefix(value: string): string {
		if (!this.containsSignedCookiePrefix(value)) {
			return value;
		}

		return value.replace(this.getSignedCookiePrefix(), '');
	}

	private static setSignedCookiePrefix(value: string): string {
		if (this.containsSignedCookiePrefix(value)) {
			return value;
		}

		return this.getSignedCookiePrefix() + value;
	}

}




